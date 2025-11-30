import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getServerQueryClient } from "@/shared/libs/TanstackQuery/queryClient.server";

import { getUserHistoryList } from "../api/userHistoryList";
import { getParsedHistoryListKey } from "../utils/getParsedHistoryListKey";
import HistoryList from "./HistoryList";

const HistoryListLayout = async ({ userId }: { userId: string }) => {
  const queryClient = getServerQueryClient()();

  /*
  굳이 server에서 해야하나? 
  await queryClient.fetchInfiniteQuery({
    queryKey: getParsedHistoryListKey({ userId }),
    queryFn: ({ pageParam }) => getUserHistoryList({ userId, pageParam })(),
    initialPageParam: 0,
  });
  */

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <HistoryList userId={userId} />
      </>
    </HydrationBoundary>
  );
};

export default HistoryListLayout;
