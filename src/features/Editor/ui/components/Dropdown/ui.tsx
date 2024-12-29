"use client";

import { Root } from "@radix-ui/react-portal";

import React from "react";

import { useEditorSelector } from "@/features/Editor/hooks";

export const EditorDropdown = () => {
  const isOpen = useEditorSelector((state) => state.dropdown.isOpen);
  const position = useEditorSelector((state) => state.dropdown.position);

  if (!isOpen) return null;

  return (
    <Root>
      (
      <ul

        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          listStyleType: "none",
          padding: "8px",
          backgroundColor: "white",
          border: "1px solid #ccc",
        }}
      />
      )
    </Root>
  );
};
