import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/shared";

import { getUserHistoryList } from "../api/userHistoryList";
import { getParsedHistoryListKey } from "../utils/getParsedHistoryListKey";
import HistoryList from "./HistoryList";

const HistoryListLayout = async ({ userId }: { userId: string }) => {
  const queryClient = getQueryClient();
  await queryClient.fetchInfiniteQuery({
    queryKey: getParsedHistoryListKey({ userId }),
    queryFn: ({ pageParam }) => getUserHistoryList({ userId, pageParam })(),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full ">
        <HistoryList userId={userId} />
      </div>
    </HydrationBoundary>
  );
};

export default HistoryListLayout;
