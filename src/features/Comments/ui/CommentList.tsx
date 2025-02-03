"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { useIntersectionObserver } from "@/shared/hooks";

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
        fetchNextPage(); // 다음 페이지 로드
      }
    },
    { threshold: 1.0 }
  );

  return (
    <div>
      {/* 댓글 리스트 */}
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.comments.map((comment: any) => (
            <div
              key={comment.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt!).toLocaleString()}</small>
            </div>
          ))}
        </React.Fragment>
      ))}

      {/* 로드 상태 표시 */}
      <div ref={loadMoreRef} style={{ textAlign: "center", padding: "20px" }}>
        {isFetchingNextPage
          ? "불러오는 중..."
          : hasNextPage
          ? "스크롤 다운하여 더 불러오기"
          : "더 이상 댓글이 없습니다."}
      </div>
    </div>
  );
};

export default CommentList;
