"use client";

import { useEffect, useMemo, useState } from "react";

import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";

const STORAGE_KEY = "offline-demo-outbox";

type OutboxItem = {
  id: string;
  content: string;
  createdAt: number;
  status: "queued" | "sending" | "sent" | "failed";
  error?: string;
};

const safeParseQueue = (): OutboxItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as OutboxItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse outbox", error);
    return [];
  }
};

const persistQueue = (queue: OutboxItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

const createItem = (content: string): OutboxItem => ({
  id: crypto.randomUUID?.() ?? `outbox-${Date.now()}`,
  content,
  createdAt: Date.now(),
  status: "queued",
});

const OfflineDemo = () => {
  const [message, setMessage] = useState("");
  const [queue, setQueue] = useState<OutboxItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setQueue(safeParseQueue());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    persistQueue(queue);
  }, [queue]);

  useEffect(() => {
    if (isOnline && !isFlushing && queue.some((item) => item.status === "queued" || item.status === "failed")) {
      void flushQueue();
    }
  }, [isOnline, isFlushing, queue]);

  const hasPending = useMemo(() => queue.some((item) => item.status === "queued" || item.status === "failed"), [queue]);

  const addMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    setQueue((prev) => [...prev, createItem(trimmed)]);
    setMessage("");
  };

  const updateStatus = (id: string, status: OutboxItem["status"], error?: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              error,
            }
          : item,
      ),
    );
  };

  const flushQueue = async () => {
    if (isFlushing) {
      return;
    }

    setIsFlushing(true);

    for (const item of queue) {
      if (item.status === "sent") {
        continue;
      }

      updateStatus(item.id, "sending");

      try {
        const response = await fetch("/api/offline-demo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            message: item.content,
            createdAt: item.createdAt,
          }),
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        updateStatus(item.id, "sent");
      } catch (error) {
        console.error("Failed to flush", error);
        updateStatus(item.id, "failed", error instanceof Error ? error.message : "Unknown error");
      }
    }

    setIsFlushing(false);
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
          입력한 메시지는 Outbox (로컬 영속 큐)에 저장됩니다. 오프라인이어도 큐에 기록되며, 온라인 상태가 되면 자동으로 Next API
          route로 전송되어 서버 콘솔에 기록됩니다.
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
            onClick={addMessage}
            className="rounded-lg bg-text-01 px-4 py-2 text-background-01 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!message.trim()}
          >
            Outbox에 추가
          </button>
          <button
            type="button"
            onClick={() => void flushQueue()}
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
          <p className="caption-1 text-text-03">자동 저장 및 재전송</p>
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
