import React from "react";
import { CommentsProps } from "./type";
import Comments from "./Comments";
import { getQueryClient } from "@/shared";
import { getParsedBoardKey } from "../utils/constant";
import { fetchComments } from "../api/fetchComments";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CommentLayout = async ({ userId, boardId }: CommentsProps) => {
  const queryClient = getQueryClient();
  await queryClient.fetchInfiniteQuery({
    queryKey: getParsedBoardKey({ boardId, userId }),
    queryFn: ({ pageParam }) => fetchComments({ boardId, pageParam }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments userId={userId} boardId={boardId} />
    </HydrationBoundary>
  );
};

export default CommentLayout;
