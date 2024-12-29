import React from "react";
import { MessageSquareText } from "lucide-react";

import { ICON_MARK_BUTTON_SIZE } from "@/features/Editor/constants";
import { cn } from "@/shared";
import Divider from "../Divider";
import CommandTooltipContent from "../CommandTooltip/CommandTooltipContent";
import { Button, Tooltip } from "@/shared/ui";

const Comment = () => {
  return (
    <>
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            disabled
            className={cn("p-1 gap-0.5 bg-color-background-disabled")}
            variant="text"
            size="small"
            aria-label={"add comment"}
          >
            <MessageSquareText style={{ width: `${ICON_MARK_BUTTON_SIZE}px`, height: `${ICON_MARK_BUTTON_SIZE}px` }} />
            &nbsp;(0)
          </Button>
        </Tooltip.Trigger>

        <CommandTooltipContent>
          <CommandTooltipContent.Description>comment (not released yet!)</CommandTooltipContent.Description>
        </CommandTooltipContent>
      </Tooltip>

      <Divider />
    </>
  );
};

export default Comment;
