"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { getQueryClient } from "@/shared";
import { Input } from "@/shared/ui";
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
    <form onSubmit={handleSubmit} className="flex justify-center items-center w-full px-4">
      <Input
        wrapperClassName="w-full"
        value={content}
        setValue={(newValue) => {
          setContent(newValue);
        }}
        placeholder="댓글을 입력하세요..."
      />
    </form>
  );
};

export default CommentInput;
