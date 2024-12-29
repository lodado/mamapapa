"use client";
 
import React from "react";

import { useEditorDispatch, useEditorSelector } from "@/features/Editor/hooks";
 

import "./index.scss";

import { Comment } from "./components";
import Divider from "./components/Divider";
import { MarkContainer, NodeContainer } from "./components";
import AdditionalOptionDropdown from "./components/AdditionalOptionDropdown/AdditionalOptionDropdown";
import { Tooltip } from "@/shared/ui";

export const EditorMarkTooltip = () => {
  const isOpen = useEditorSelector((state) => state.markToolTip.isOpen);
  const position = useEditorSelector((state) => state.markToolTip.position);
  const dispatch = useEditorDispatch();

  return (
    <Tooltip
      open={isOpen}
      defaultOpen={false}
      onOpenChange={() => {
        // if (isOpen) dispatch(RESET_EDITOR_MARK_TOOLTIP());
      }}
    >
      <Tooltip.Content
        lang="en"
        data-state={isOpen ? "delayed-open" : "closed"}
        className="TooltipContent absolute h-[2rem] bg-color-background-input-default"
        style={{ insetInlineStart: position.x, insetBlockStart: Math.max(position.y, 100) }}
        variant="primary"
        side={"top"}
      >
        <div className="flex    items-center justify-center gap-x-[0.1rem]">
          <Comment />

          <MarkContainer />

          <Divider />

          <NodeContainer />

          <Divider />

          <AdditionalOptionDropdown />
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};
