"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Virtuoso } from "react-virtuoso";

import SimminIcon from "/public/SimminIcon.svg";
import { timestampToTimeFormat } from "@/shared";

import { getUserHistoryList } from "../api/userHistoryList";
import { getParsedHistoryListKey } from "../utils/getParsedHistoryListKey";

const HistoryList = ({ userId }: { userId: string }) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: getParsedHistoryListKey({ userId }),
    queryFn: ({ pageParam }) => getUserHistoryList({ userId, pageParam })(),
    getNextPageParam: (lastPage) => undefined,
    initialPageParam: 0,
  });

  const router = useRouter();

  const items = data ? data.pages.flat() : [];

  return (
    <div className="px-2 py-3 flex w-full h-[calc(80*var(--vh))]  flex-col gap-2 ">
      <Virtuoso
        data={items}
        className=" scrollbar-hide"
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        itemContent={(index, item) => (
          <div
            onClick={() => router.push(`/history/${item.id}`)}
            key={item.id}
            className="mb-2 justify-between cursor-pointer border rounded-xl border-solid border-border-01 bg-tertiary flex flex-row items-center w-full h-[5.6rem] px-2"
          >
            <div className="flex flex-row gap-2 items-center">
              <div>
                <SimminIcon />
              </div>
              <div>
                <p className="text-text-01 head-3">{item.title}</p>
                <p className="text-text-03 caption-2">{timestampToTimeFormat(new Date(item.updatedAt))}</p>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex text-text-03 flex-row min-w-[3rem] h-7 justify-center items-center gap-1 self-stretch px-2 py-1 rounded-2xl border border-solid border-border-02 bg-background-01">
                <MessageSquareText color="var(--Text-03)" />
                {item.commentCount}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default HistoryList;
