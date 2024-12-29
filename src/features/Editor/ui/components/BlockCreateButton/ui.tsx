"use client";

import { Plus } from "lucide-react";
import { Root } from "@radix-ui/react-portal";

import React from "react";

import { BlockCreateContent } from "./components/BlockCreateContent";

import { useEditorSelector } from "@/features/Editor/hooks";
import { ICON_BUTTON_SIZE } from "@/features/Editor/constants";
import { Dropdown, ScreenReaderOnly } from "@/shared/ui";

export const BlockCreateButton = () => {
  const isOpen = useEditorSelector((state) => state.blockCreateButton.isOpen);
  const position = useEditorSelector((state) => state.blockCreateButton.position);

  if (!isOpen) return null;

  return (
    <Root>
      <Dropdown>
        <Dropdown.Trigger
          type="button"
          className="bg-transparent gap-0 p-0 m-0"
          style={{
            position: "absolute",

            insetBlockStart: position.y, // top -> inset-block-start
            insetInlineStart: position.x, // left -> inset-inline-start
          }}
          variant={"custom"}
        >
          <Plus
            className="text-color-background-accent-gray-subtlest-pressed"
            size={22}
            role="none presentation"
            aria-hidden={false}
          />
          <ScreenReaderOnly>Create block</ScreenReaderOnly>
        </Dropdown.Trigger>

        <BlockCreateContent>
          <BlockCreateContent.Item>Text</BlockCreateContent.Item>
          <BlockCreateContent.Item>Image</BlockCreateContent.Item>
          <BlockCreateContent.Item>Video</BlockCreateContent.Item>
          <BlockCreateContent.Item>Divider</BlockCreateContent.Item>
        </BlockCreateContent>
      </Dropdown>
    </Root>
  );
};
