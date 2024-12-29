import React from "react";

import { ICON_MARK_BUTTON_SIZE } from "@/features/Editor/constants";
import { cn } from "@/shared";
import { Ellipsis } from "lucide-react";

import CommandTooltipContent from "../CommandTooltip/CommandTooltipContent";
 
import { Button, Tooltip } from "@/shared/ui";

const AdditionalOptionDropdown = () => {
  return (
    <>
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            disabled
            className={cn("p-1 bg-color-background-disabled")}
            variant="text"
            size="small"
            aria-label={"add comment"}
          >
            <Ellipsis style={{ width: `${ICON_MARK_BUTTON_SIZE}px`, height: `${ICON_MARK_BUTTON_SIZE}px` }} />
          </Button>
        </Tooltip.Trigger>

        <CommandTooltipContent>
          <CommandTooltipContent.Description>additional options (not released yet!)</CommandTooltipContent.Description>
        </CommandTooltipContent>
      </Tooltip>
    </>
  );
};

export default AdditionalOptionDropdown;
