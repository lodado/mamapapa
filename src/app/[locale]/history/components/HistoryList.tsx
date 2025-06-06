// components/HistoryList.tsx
"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Virtuoso } from "react-virtuoso";

import SimminIcon from "/public/SimminIcon.svg";
import { timestampToTimeFormat } from "@/shared";
import { SwipeableItem, SwipeProvider } from "@/shared/ui";

import { getUserHistoryList } from "../api/userHistoryList";
import { getParsedHistoryListKey } from "../utils/getParsedHistoryListKey";
import RemoveCommentDialog from "./RemoveHisoryDialog";

const SwipeOption = ({ id, userId }: { id: string; userId: string }) => {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const t = useTranslations("HistoryList");
  const queryClient = useQueryClient();

  return (
    <>
      <button
        type="button"
        className="w-[64px] flex items-center justify-center h-full head-3 text-text-error px-4 rounded-xl border border-solid border-error"
        onClick={() => {
          setIsRemoveDialogOpen(true);
        }}
      >
        {t("delete")}
      </button>
      <RemoveCommentDialog
        id={id as string}
        isVisible={isRemoveDialogOpen}
        onChangeVisible={setIsRemoveDialogOpen}
        onAfterSubmit={() => {
          queryClient.refetchQueries({
            queryKey: getParsedHistoryListKey({ userId }),
          });
        }}
      />
    </>
  );
};

const HistoryList = ({ userId }: { userId: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: getParsedHistoryListKey({ userId }),
    queryFn: ({ pageParam }) => getUserHistoryList({ userId, pageParam })(),
    getNextPageParam: () => undefined,
    initialPageParam: 0,
  });

  const router = useRouter();
  const items = data ? data.pages.flat() : [];

  return (
    <div className="px-2 py-3 flex w-full h-[calc(80*var(--vh))] flex-col gap-2">
      <SwipeProvider>
        <Virtuoso
          data={items}
          className="scrollbar-hide"
          endReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          itemContent={(index, item) => (
            <SwipeableItem
              leftSwipeLimit={-74}
              key={item.id}
              swipeOptionChildren={<SwipeOption id={item.id} userId={userId} />}
              resetOnOtherSwipe
            >
              <div
                onDoubleClick={() => router.push(`/history/${item.id}`)}
                className="mb-2 justify-between cursor-pointer border rounded-xl border-solid border-border-01 bg-tertiary flex flex-row items-center w-full h-[5.6rem] px-2"
              >
                <div className="flex flex-row gap-2 items-center">
                  <SimminIcon />
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
            </SwipeableItem>
          )}
        />
      </SwipeProvider>
    </div>
  );
};

export default HistoryList;
