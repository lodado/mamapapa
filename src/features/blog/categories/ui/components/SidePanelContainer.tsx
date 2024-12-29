"use client";

import { AnimationRoot, Motion } from "@/shared/ui";
import React from "react";
import { useCategoryContext } from "../SidePanelProvider";
import CollapsedPanel from "./Collapsed/CollapsedPanel";
import { cva } from "class-variance-authority";
 

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

const duration = 0.5;

const animationVariants = {
  opened: {
    scaleX: 1,

    transition: {
      scaleX: { duration: 0.3, ease: "easeInOut" },
    },
  },

  closed: {
    scaleX: -0.4,
    opacity: 1,

    transition: {
      scaleX: { duration: 0.3, ease: "easeInOut" },
    },
  },
};

const divStyles = cva("", {
  variants: {
    isOpen: {
      true: "sm:w-[12rem]",
      false: "sm:w-[3rem]",
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

const SidePanelContainer: React.FC<ScrollAreaProps> = ({ className = "", children }) => {
  const { isOpen, onceToggled, toggleSidePanel } = useCategoryContext();

  return (
    <>
      <div className={divStyles({ isOpen })} role="none presentation" />
      <AnimationRoot initial={true}>
        {
          <Motion
            type="div"
            layout
            style={{ originX: 0, top: `60px`, willChange: "transform, opacity" }}
            className="fixed left-0 top-[64px] z-dialog overflow-x-hidden overflow-y-auto bottom-0 min-w-[250px]  sm:min-w-0 sm:max-w-[100vw] w-screen max-w-[66vw] sm:w-[12rem] max-h-screen px-[0.75rem] pt-[1rem]  bg-background border-t border-r border-color-border-input"
            variants={animationVariants}
            initial={"closed"}
            animate={onceToggled && isOpen ? "opened" : "closed"}
          >
            <>{isOpen && children}</>
          </Motion>
        }
      </AnimationRoot>
      <div className="hidden sm:flex sm:fixed overflow-x-hidden overflow-y-auto left-0 w-[3rem] px-[0.75rem] pt-[2rem] flex-col border-t items-center bg-background border-r border-color-border-input h-full">
        <CollapsedPanel />
      </div>
    </>
  );
};

export default SidePanelContainer;
