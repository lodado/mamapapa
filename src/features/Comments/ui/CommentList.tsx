"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { useIntersectionObserver } from "@/shared/hooks";
import { Image } from "@/shared/ui";

import { fetchComments } from "../api/fetchComments";
import { getParsedBoardKey } from "../utils/constant";

const CommentList = ({ boardId, userId }: { boardId: string; userId: string }) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: getParsedBoardKey({ boardId, userId }),
    queryFn: ({ pageParam = 0 }) => fetchComments({ boardId, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        // fetchNextPage(); // 다음 페이지 로드
      }
    },
    { threshold: 1.0 }
  );

  return (
    <div>
      {/* 댓글 리스트 */}
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.comments.map((comment) => {
            return (
              <div key={comment.id} className="w-full p-3 gap-4 flex flex-row items-center">
                <div>
                  <Image
                    className="rounded-full"
                    isPreload={false}
                    width={40}
                    height={40}
                    src={comment.image ?? ""}
                    alt="comment"
                  />
                </div>

                <div className="flex flex-col justify-between h-full w-full">
                  <div className="flex flex-row gap-1">
                    <p className="text-text-01 caption-2">{comment.name}</p>
                    <p className="text-text-03 caption-2">{new Date(comment.createdAt!).toLocaleString()}</p>
                  </div>

                  <span className="text-text-01 body-2">{comment.content}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* 로드 상태 표시 */}
      <div ref={loadMoreRef} style={{ textAlign: "center", padding: "1px" }}>
        {/** 
         *  {isFetchingNextPage
          ? "불러오는 중..."
          : hasNextPage
          ? "스크롤 다운하여 더 불러오기"
          : "더 이상 댓글이 없습니다."}
         */}
      </div>
    </div>
  );
};

export default CommentList;
