"use client";

import { IconButton, Motion } from "@/shared/ui";
import React, { useState } from "react";
import { PanelRight } from "lucide-react";
import { useCategoryContext } from "../SidePanelProvider";

const SideFoldButton = () => {
  const { toggleSidePanel } = useCategoryContext();

  return (
    <IconButton
      className="w-1 h-1 text-color-icon-subtle"
      size="custom"
      variant="text"
      asChild
      onClick={toggleSidePanel}
    >
      <Motion type="button" initial={false} transition={{ type: "tween", duration: 0.3 }}>
        <PanelRight size={20} />
      </Motion>
    </IconButton>
  );
};

export default SideFoldButton;
