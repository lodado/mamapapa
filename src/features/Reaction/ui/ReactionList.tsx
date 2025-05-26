"use client";

import Image from "next/image";
import React from "react";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { useMutationWithNotification } from "@/shared/hooks";
import { BadgeButton, useQueryContainer } from "@/shared/ui";

import { fetchReaction, postReaction } from "../api/fetchReactions";
import { getParsedReactionKey } from "../utils/constant";
import { getOptimisticUpdateReactions } from "../utils/getOptimisticUpdateReactions";
import CopyLinkButton from "./CopyLinkButton";

interface ReactionListProps {
  userId: string;
  boardId: string;
}

const ICON_SIZE = 24;

const ReactionList: React.FC<ReactionListProps> = ({ userId, boardId }) => {
  const { isLogin } = useAuthStore();

  const auth = {
    canUpdateReaction: isLogin,
  } as const;

  // --- TanStack Query ------------------------------------------------------
  const {
    query: { data },
    handleOptimisticUpdate: handleOptimisticReactionUpdate,
    revertOptimisticUpdate: revertOptimisticReactionUpdate,
  } = useQueryContainer({
    queryKey: getParsedReactionKey({ boardId, userId }),
    queryFn: () => fetchReaction({ boardId, userId }),
    queryOptions: {},
  });

  const userReaction = data!.userReaction!;

  // --- Mutation (optimistic) ------------------------------------------------
  const { mutate } = useMutationWithNotification({
    mutationFn: async ({ liked, thumbsUp, bbangparay }: { liked: boolean; thumbsUp: boolean; bbangparay: boolean }) => {
      handleOptimisticReactionUpdate(
        getOptimisticUpdateReactions({
          userReaction,
          liked,
          thumbsUp,
          bbangparay,
        })
      );

      return postReaction({ boardId, userId, liked, thumbsUp, bbangparay });
    },
    onSuccess: async () => {},
    onError: async () => {
      revertOptimisticReactionUpdate();
    },
  });

  // -------------------------------------------------------------------------
  return (
    <div className="px-4 flex flex-row w-full h-12 gap-1 items-center">
      <CopyLinkButton />

      {/* Thumbs Up */}
      <BadgeButton
        type="button"
        variant={userReaction.thumbsUp ? "isSelected" : "line"}
        onClick={() => {
          mutate({ ...userReaction, thumbsUp: !userReaction.thumbsUp });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <Image src="/emoticon/ThumbsUpEmoticon.svg" alt="Thumbs Up" width={ICON_SIZE} height={ICON_SIZE} priority />
        {data?.thumbsUpCount}
      </BadgeButton>

      {/* Like */}
      <BadgeButton
        type="button"
        variant={userReaction.liked ? "isSelected" : "line"}
        onClick={() => {
          mutate({ ...userReaction, liked: !userReaction.liked });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <Image src="/emoticon/LoveEmoticon.svg" alt="Love" width={ICON_SIZE} height={ICON_SIZE} priority />
        {data?.likeCount}
      </BadgeButton>

      {/* Bbangparay */}
      <BadgeButton
        type="button"
        variant={userReaction.bbangparay ? "isSelected" : "line"}
        onClick={() => {
          mutate({ ...userReaction, bbangparay: !userReaction.bbangparay });
        }}
        disabled={!auth.canUpdateReaction}
      >
        <Image src="/emoticon/BbangparayEmoticon.svg" alt="Bbangparay" width={ICON_SIZE} height={ICON_SIZE} priority />
        {data?.bbangparayCount}
      </BadgeButton>
    </div>
  );
};

export default ReactionList;
