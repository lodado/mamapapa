import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/shared";

import { fetchComments } from "../api/fetchComments";
import { getParsedBoardKey } from "../utils/constant";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { CommentsProps } from "./type";

const CommentLayout = async ({ userId, boardId }: CommentsProps) => {
  const queryClient = getQueryClient();
  await queryClient.fetchInfiniteQuery({
    queryKey: getParsedBoardKey({ boardId, userId }),
    queryFn: ({ pageParam }) => fetchComments({ boardId, pageParam }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full bg-red-100">
        <CommentList userId={userId} boardId={boardId} />
      </div>
    </HydrationBoundary>
  );
};

export default CommentLayout;
