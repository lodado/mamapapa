"use client";

import React from "react";

import { ICON_MARK_BUTTON_SIZE } from "@/features/Editor/constants";
import useNodeCommand from "./useNode";
import { IconButton } from "@/shared/ui";

import { List, Image } from "lucide-react";

export const NodeContainer = () => {
  return (
    <div className="flex items-center gap-x-2 p-2">
      <IconButton variant="custom" size="small" aria-label="Bulleted list">
        <List className="text-background-inverse" size={ICON_MARK_BUTTON_SIZE} />
      </IconButton>
      <IconButton variant="custom" size="small" aria-label="Insert image">
        <Image className="text-background-inverse" size={ICON_MARK_BUTTON_SIZE} />
      </IconButton>
    </div>
  );
};

export default NodeContainer;
