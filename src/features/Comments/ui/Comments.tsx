"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { fetchComments, updateComments } from "../api/fetchComments";
import { useIntersectionObserver } from "@/shared/hooks";
import { getParsedBoardKey } from "../utils/constant";
import { CommentsProps } from "./type";
import { useToastStore } from "@/shared/ui/Toast/stores";

const Comments = ({ userId, boardId }: CommentsProps) => {
  const { addToast } = useToastStore();

  const [content, setContent] = useState("");

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: getParsedBoardKey({ boardId, userId }),
    queryFn: ({ pageParam = 0 }) => fetchComments({ boardId, pageParam }),
    // 서버에서 반환한 nextCursor가 없으면 undefined 처리
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  // 댓글 추가를 위한 useMutation
  const mutation = useMutation({
    mutationFn: updateComments,
    onSuccess: () => {
      // 댓글 등록 후 댓글 목록 새로 불러오기
      refetch();
    },
    onError: (error) => {
      addToast({
        title: "에러",
        description: `${error.message}`,
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ boardId, userId, content });
    setContent("");
  };

  const loadMoreRef = useIntersectionObserver(
    (entry, observer) => {
      // 대상 엘리먼트가 보이면 다음 페이지 데이터를 불러옴
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 1.0 }
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>댓글</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          rows={3}
          style={{ width: "100%", padding: "10px" }}
        />
        <button type="submit" style={{ marginTop: "10px" }}>
          등록
        </button>
      </form>

      {error && <div>에러: {(error as Error).message}</div>}

      {/* 댓글 리스트 */}
      <div>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.comments.map((comment) => (
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
      </div>

      {/* 스크롤 감지를 위한 요소 */}
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

export default Comments;
