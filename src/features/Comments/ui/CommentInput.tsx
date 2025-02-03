"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { getQueryClient } from "@/shared";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { updateComments } from "../api/fetchComments";
import { getParsedBoardKey } from "../utils/constant";

const CommentInput = ({ userId, boardId }: { userId: string; boardId: string }) => {
  const { addToast } = useToastStore();
  const [content, setContent] = useState("");

  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: updateComments,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: getParsedBoardKey({ boardId, userId }),
      });
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
    mutation.mutate({ content, userId, boardId });
    setContent(""); // 입력 후 초기화
  };

  return (
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
  );
};

export default CommentInput;
