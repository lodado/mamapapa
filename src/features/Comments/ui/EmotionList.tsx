import React from "react";

import BbangparayEmoticon from "/public/emoticon/BbangparayEmoticon.svg";
import LoveEmoticon from "/public/emoticon/LoveEmoticon.svg";
import ThumbsUpEmoticon from "/public/emoticon/ThumbsUpEmoticon.svg";
import ShardLink from "/public/ShareLink.svg";

const IconButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      className="flex flex-row h-7 min-w-[2.8rem] bg-background-01 gap-1 px-2 py-1 rounded-2xl border border-border-02 items-center justify-center text-text-03"
      type="button"
    >
      {children}
    </button>
  );
};

const EmotionList = ({ userId, boardId }: { userId: string; boardId: string }) => {
  return (
    <div className="px-4 flex flex-row w-full h-12 gap-1 items-center">
      <button type="button">
        <ShardLink />
      </button>

      <IconButton>
        <ThumbsUpEmoticon /> 0
      </IconButton>

      <IconButton>
        <LoveEmoticon />0
      </IconButton>

      <IconButton>
        <BbangparayEmoticon /> 0
      </IconButton>
    </div>
  );
};

export default EmotionList;
