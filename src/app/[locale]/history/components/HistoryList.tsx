"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import SimminIcon from "/public/SimminIcon.svg";
import { timestampToTimeFormat } from "@/shared";
import { useIntersectionObserver } from "@/shared/hooks";

import { getUserHistoryList } from "../api/userHistoryList";
import { HistoryResponse } from "../stores/type";
import { getParsedHistoryListKey } from "../utils/getParsedHistoryListKey";

const HistoryList = ({ userId }: { userId: string }) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: getParsedHistoryListKey({ userId }),
    queryFn: ({ pageParam }) => getUserHistoryList({ userId, pageParam })(),
    getNextPageParam: (lastPage) => undefined,
    initialPageParam: 0,
  });

  const router = useRouter();

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        // fetchNextPage(); // 다음 페이지 로드
      }
    },
    { threshold: 1.0 }
  );

  return (
    <div className="px-2 py-3 flex flex-col  gap-2 ">
      {/* 댓글 리스트 */}
      {data?.pages.map((page, pageIndex) => {
        return page.map(({ title, id, updatedAt, commentCount }: HistoryResponse) => {
          return (
            <div
              onClick={() => router.push(`/history/${id}`)}
              key={id}
              className="justify-between cursor-pointer border rounded-xl border-solid border-border-01 bg-tertiary flex flex-row items-center w-full h-[5.6rem] px-2"
            >
              <div className="flex flex-row gap-2 items-center">
                <div>
                  <SimminIcon />
                </div>

                <div>
                  <p className="text-text-01 head-3">{title}</p>
                  <p className="text-text-03 caption-2">{timestampToTimeFormat(new Date(updatedAt))}</p>
                </div>
              </div>

              <div className="flex flex-row items-center">
                <div className="flex text-text-03 flex-row min-w-[3rem] h-7 justify-center items-center gap-1 self-stretch px-2 py-1 rounded-2xl border border-solid border-border-02 bg-background-01">
                  <MessageSquareText color="var(--Text-03)" />
                  {commentCount}
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default HistoryList;
