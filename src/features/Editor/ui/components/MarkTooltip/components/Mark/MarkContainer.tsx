"use client";

import React from "react";
import { cn } from "@/shared";
import { Button, IconButton, ScreenReaderOnly, Tooltip } from "@/shared/ui";


import { Bold, Italic, Underline, Strikethrough, Code, Link, ChevronDown } from "lucide-react";

import { ICON_MARK_BUTTON_SIZE } from "@/features/Editor/constants";

import useMarkCommand from "../../../../../hooks/useMarkCommand";
import CommandTooltipContent from "../CommandTooltip/CommandTooltipContent";
import { MarkSelection } from "./style";
import { EDITOR_LINK_DIALOG_OPEN } from "../../../LinkDialog/model";
import { useEditorDispatch } from "@/features/Editor/hooks";

const buttonData = [
  {
    label: "Bold",
    command: "Bold" as const,
    Icon: Bold,
    width: ICON_MARK_BUTTON_SIZE,
    height: ICON_MARK_BUTTON_SIZE,
    showCondition: true, // 항상 렌더링
    commandDescription: "⌘-B",
    strokeWidth: 3.1,
  },
  {
    label: "Italic",
    command: "Italic" as const,
    Icon: Italic,
    width: ICON_MARK_BUTTON_SIZE,
    height: ICON_MARK_BUTTON_SIZE,
    showCondition: true, // 항상 렌더링
    commandDescription: "⌘-I",
    strokeWidth: 2.2,
  },
  {
    label: "Underline",
    command: "Underline" as const,
    Icon: Underline,
    width: ICON_MARK_BUTTON_SIZE,
    height: ICON_MARK_BUTTON_SIZE,
    showCondition: true, // 항상 렌더링
    commandDescription: "⌘-U",
    strokeWidth: 2.2,
  },
  {
    label: "Strikethrough",
    command: "Strike" as const,
    Icon: Strikethrough,
    width: ICON_MARK_BUTTON_SIZE,
    height: ICON_MARK_BUTTON_SIZE,
    showCondition: true, // 항상 렌더링
    commandDescription: "⌘-D",
    strokeWidth: 2.2,
  },
  {
    label: "Code block",
    command: "InlineCodeSnippet" as const,
    Icon: Code,
    width: ICON_MARK_BUTTON_SIZE,
    height: ICON_MARK_BUTTON_SIZE,
    showCondition: true, // 항상 렌더링
    commandDescription: "⌘-`",
    strokeWidth: 2.2,
  },
] as const;

const MarkContainer = () => {
  const { toggleMarkCommand, isSelectionWithinNode, hasMarkInSelection } = useMarkCommand();
  const editorDispatch = useEditorDispatch();

  return (
    <div className="flex items-center justify-center gap-x-1 text-background-inverse">
      {buttonData.map(
        ({ label, command, Icon, width, height, showCondition, commandDescription, strokeWidth }, index) =>
          showCondition && (
            <Tooltip key={label || index}>
              <Tooltip.Trigger>
                <IconButton
                  className={cn(MarkSelection({ markState: hasMarkInSelection(command) }), "p-1")}
                  onClick={command ? toggleMarkCommand(command) : undefined}
                  variant="text"
                  size="small"
                  aria-label={label}
                >
                  <Icon strokeWidth={strokeWidth} style={{ width: `${width}px`, height: `${height}px` }} />
                </IconButton>
              </Tooltip.Trigger>

              <CommandTooltipContent>
                <CommandTooltipContent.Description>{label}</CommandTooltipContent.Description>
                <CommandTooltipContent.CommandDescription>
                  {commandDescription}
                </CommandTooltipContent.CommandDescription>
              </CommandTooltipContent>
            </Tooltip>
          )
      )}
      {isSelectionWithinNode() && (
        <>
          <Tooltip>
            <Tooltip.Trigger>
              <Button
                size="custom"
                type="button"
                variant="text"
                className="flex justify-center items-center p-1  disabled:opacity-1"
                aria-label="Insert link"
                onClick={() => {
                  editorDispatch(EDITOR_LINK_DIALOG_OPEN());
                }}
              >
                <Link
                  strokeWidth={2.6}
                  className="text-background-inverse"
                  style={{ width: `${ICON_MARK_BUTTON_SIZE}px`, height: `${ICON_MARK_BUTTON_SIZE}px` }}
                />

                <ChevronDown
                  className="text-background-inverse"
                  strokeWidth={2.6}
                  style={{ width: `${ICON_MARK_BUTTON_SIZE / 2}px`, height: `${ICON_MARK_BUTTON_SIZE / 2}px` }}
                />
              </Button>
            </Tooltip.Trigger>

            <CommandTooltipContent>
              <CommandTooltipContent.Description>Insert Link</CommandTooltipContent.Description>
              <CommandTooltipContent.CommandDescription>⌘-K</CommandTooltipContent.CommandDescription>
            </CommandTooltipContent>
          </Tooltip>
        </>
      )}
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            size="custom"
            type="button"
            variant="text"
            className="flex justify-center p-1 items-center"
            aria-label="Change color"
          >
            <div
              className="rounded-full bg-background border-dashed border-[0.1px] border-background-inverse mr-1"
              style={{ width: `${ICON_MARK_BUTTON_SIZE / 1.5}px`, height: `${ICON_MARK_BUTTON_SIZE / 1.5}px` }}
              role="presentation none"
            />

            <ChevronDown
              className="text-background-inverse"
              style={{ width: `${ICON_MARK_BUTTON_SIZE / 2}px`, height: `${ICON_MARK_BUTTON_SIZE / 2}px` }}
            />

            <ScreenReaderOnly>Change Color</ScreenReaderOnly>
          </Button>
        </Tooltip.Trigger>

        <CommandTooltipContent>
          <CommandTooltipContent.Description>Change Color</CommandTooltipContent.Description>
          <CommandTooltipContent.CommandDescription>⌘-Ctrl-H</CommandTooltipContent.CommandDescription>
        </CommandTooltipContent>
      </Tooltip>
    </div>
  );
};

export default MarkContainer;
