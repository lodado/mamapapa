"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

import BbangparayEmoticon from "/public/emoticon/BbangparayEmoticon.svg";
import LoveEmoticon from "/public/emoticon/LoveEmoticon.svg";
import ThumbsUpEmoticon from "/public/emoticon/ThumbsUpEmoticon.svg";
import ShardLink from "/public/ShareLink.svg";
import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { useMutationWithNotification } from "@/shared/hooks";
import { useQueryContainer } from "@/shared/ui";

import { fetchReaction, postReaction } from "../api/fetchReactions";
import { getParsedReactionKey } from "../utils/constant";

const IconButton = ({ children, ...rest }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="flex flex-row h-7 min-w-[2.8rem] bg-background-01 gap-1 px-2 py-1 rounded-2xl border border-border-02 items-center justify-center text-text-03"
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

const ReactionList = ({ userId, boardId }: { userId: string; boardId: string }) => {
  const queryClient = useQueryClient();
  const { isLogin } = useAuthStore();

  const auth = isLogin
    ? {
        canUpdateReaction: true,
      }
    : {
        canUpdateReaction: false,
      };

  const {
    query: { data },
  } = useQueryContainer({
    queryKey: getParsedReactionKey({ boardId, userId }),
    queryFn: () => fetchReaction({ boardId, userId }),
    queryOptions: {
      staleTime: Infinity,
      placeholderData: {
        likeCount: 0,
        thumbsUpCount: 0,
        bbangparayCount: 0,
        userReaction: {
          id: 0,
          userId: "",
          boardId: "",
          liked: false,
          thumbsUp: false,
          bbangparay: false,
        },
      },
    },
  });

  const userReaction = data!.userReaction!;

  const { mutate } = useMutationWithNotification({
    mutationFn: async ({ liked, thumbsUp, bbangparay }: { liked: boolean; thumbsUp: boolean; bbangparay: boolean }) => {
      return postReaction({ boardId, userId, liked, thumbsUp, bbangparay });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [getParsedReactionKey({ boardId, userId })] });
    },
    onError: async () => {},
  });

  return (
    <div className="px-4 flex flex-row w-full h-12 gap-1 items-center">
      <button type="button">
        <ShardLink />
      </button>

      <IconButton
        type="button"
        onClick={() => {
          mutate({ ...userReaction, thumbsUp: !userReaction?.thumbsUp });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <ThumbsUpEmoticon /> {data?.thumbsUpCount}
      </IconButton>

      <IconButton
        onClick={() => {
          mutate({ ...userReaction, liked: !userReaction?.liked });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <LoveEmoticon /> {data?.likeCount}
      </IconButton>

      <IconButton
        onClick={() => {
          mutate({ ...userReaction, bbangparay: !userReaction?.bbangparay });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <BbangparayEmoticon /> {data?.bbangparayCount}
      </IconButton>
    </div>
  );
};

export default ReactionList;
