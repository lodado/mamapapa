import React from "react";
import { CommentsProps } from "./type";
import CommentList from "./CommentList";
import { getQueryClient } from "@/shared";
import { getParsedBoardKey } from "../utils/constant";
import { fetchComments } from "../api/fetchComments";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CommentInput from "./CommentInput";

const CommentLayout = async ({ userId, boardId }: CommentsProps) => {
  const queryClient = getQueryClient();
  await queryClient.fetchInfiniteQuery({
    queryKey: getParsedBoardKey({ boardId, userId }),
    queryFn: ({ pageParam }) => fetchComments({ boardId, pageParam }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentInput userId={userId} boardId={boardId} />

      <CommentList userId={userId} boardId={boardId} />
    </HydrationBoundary>
  );
};

export default CommentLayout;
