"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";

import { getAllOutboxItems, OutboxItem, putOutboxItem } from "./outboxStorage";

const createItem = (content: string): OutboxItem => ({
  id: crypto.randomUUID?.() ?? `outbox-${Date.now()}`,
  content,
  createdAt: Date.now(),
  status: "queued",
});

type ServiceWorkerMessage =
  | { type: "outbox-queue"; queue: OutboxItem[] }
  | { type: "sync-start" }
  | { type: "sync-complete" };

const OfflineDemo = () => {
  const [message, setMessage] = useState("");
  const [queue, setQueue] = useState<OutboxItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const loadQueue = async () => {
    if (typeof window === "undefined") return;
    const items = await getAllOutboxItems();
    setQueue(items);
  };

  const sendToServiceWorker = (payload: Record<string, unknown>) => {
    const activeWorker = swRegistrationRef.current?.active ?? navigator.serviceWorker.controller;
    activeWorker?.postMessage(payload);
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    void loadQueue();

    if ("serviceWorker" in navigator) {
      const handleMessage = (event: MessageEvent<ServiceWorkerMessage>) => {
        if (!event.data) return;

        if (event.data.type === "outbox-queue") {
          setQueue(event.data.queue);
          return;
        }

        if (event.data.type === "sync-start") {
          setIsFlushing(true);
          return;
        }

        if (event.data.type === "sync-complete") {
          setIsFlushing(false);
          void loadQueue();
        }
      };

      navigator.serviceWorker.addEventListener("message", handleMessage);

      void (async () => {
        try {
          const registration = await navigator.serviceWorker.register("/offline-demo-sw.js");
          const ready = await navigator.serviceWorker.ready;
          swRegistrationRef.current = ready;
          setServiceWorkerReady(true);
          const worker = ready.active ?? registration.active;
          worker?.postMessage({ type: "request-queue" });
          worker?.postMessage({ type: "network-status", online: navigator.onLine });
        } catch (error) {
          console.error("Service worker registration failed", error);
        }
      })();

      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sendToServiceWorker({ type: "network-status", online: true });
      sendToServiceWorker({ type: "manual-sync" });
    };
    const handleOffline = () => {
      setIsOnline(false);
      sendToServiceWorker({ type: "network-status", online: false });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const hasPending = useMemo(
    () => queue.some((item) => item.status === "queued" || item.status === "failed"),
    [queue],
  );

  const addMessage = async () => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    const item = createItem(trimmed);
    await putOutboxItem(item);
    setMessage("");
    await loadQueue();

    if (isOnline && serviceWorkerReady) {
      sendToServiceWorker({ type: "manual-sync" });
    }
  };

  const requestFlush = () => {
    if (!hasPending) return;
    setIsFlushing(true);
    sendToServiceWorker({ type: "manual-sync" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background-01 px-4 py-12 text-text-01">
      <div className="mb-6 flex w-full max-w-3xl flex-col gap-3 rounded-xl border border-border-02 bg-background-op-02 p-6 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="caption-1 text-text-03">Network</p>
            <p className="body-1 font-semibold">{isOnline ? "온라인" : "오프라인"}</p>
          </div>

          <ButtonLink variant="primaryLine" href={PAGE_ROUTE.MAIN}>
            홈으로
          </ButtonLink>
        </div>

        <p className="body-2 text-text-02">
          입력한 메시지는 IndexedDB 기반 Outbox (로컬 영속 큐)에 저장됩니다. 오프라인이어도 큐에 기록되며, 서비스 워커가 Background Sync
          로 온라인 복구 시 큐를 Next API route로 전송하여 서버 콘솔에 기록합니다.
        </p>
      </div>

      <div className="mb-4 flex w-full max-w-3xl flex-col gap-3 rounded-xl border border-border-02 bg-background-op-02 p-6 shadow-md">
        <label className="caption-1 text-text-03" htmlFor="message">
          메시지 작성
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-border-02 bg-background-02 p-3 outline-none focus:border-text-01"
          placeholder="오프라인 상태에서도 저장됩니다"
        />
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => void addMessage()}
            className="rounded-lg bg-text-01 px-4 py-2 text-background-01 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!message.trim() || !serviceWorkerReady}
          >
            Outbox에 추가
          </button>
          <button
            type="button"
            onClick={requestFlush}
            className="rounded-lg border border-text-01 px-4 py-2 text-text-01 transition hover:bg-text-01 hover:text-background-01 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!hasPending || isFlushing}
          >
            {isFlushing ? "전송 중" : "바로 전송"}
          </button>
        </div>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-xl border border-border-02 bg-background-op-02 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <p className="body-1 font-semibold">Outbox</p>
          <p className="caption-1 text-text-03">자동 저장 및 Background Sync</p>
        </div>

        {queue.length === 0 ? (
          <p className="body-2 text-text-03">저장된 메시지가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {queue
              .toSorted((a, b) => b.createdAt - a.createdAt)
              .map((item) => (
                <li key={item.id} className="flex flex-col gap-1 rounded-lg border border-border-02 bg-background-01 p-4">
                  <div className="flex items-center justify-between">
                    <span className="caption-1 text-text-03">
                      {new Date(item.createdAt).toLocaleString()} • {item.id}
                    </span>
                    <span
                      className={`body-3 rounded-full px-2 py-1 text-xs font-semibold ${
                        item.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : item.status === "sending"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="body-2 whitespace-pre-wrap text-text-02">{item.content}</p>
                  {item.error ? <p className="caption-1 text-red-500">{item.error}</p> : null}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OfflineDemo;
