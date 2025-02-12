"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import React, { PropsWithChildren, useState } from "react";

interface SwipeableItemProps {
  leftSwipeLimit?: number;
  children: React.ReactNode;
  swipeOptionChildren: React.ReactNode;

  onSwipeLeft?: () => void;
}

export const SwipeOptionContainer = ({ isSwiped, children }: PropsWithChildren & { isSwiped: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isSwiped ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ originX: 1 }}
      className="absolute right-0 top-0 inset-0 flex h-full justify-end items-center "
    >
      {children}
    </motion.div>
  );
};

const SwipeableItem: React.FC<SwipeableItemProps> = ({
  leftSwipeLimit = -50,
  children,
  swipeOptionChildren,
  onSwipeLeft,
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);

  // throttle 내부적으로 적용
  const handleDrag = async (event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < leftSwipeLimit) {
      await controls.start({ x: leftSwipeLimit });
      setIsSwiped(true);
      onSwipeLeft?.();
    } else {
      controls.start({ x: 0 });
      setIsSwiped(false);
    }
  };

  return (
    <div className="relative">
      <motion.div
        drag="x"
        dragConstraints={{ left: leftSwipeLimit, right: 0 }}
        dragElastic={0.004}
        style={{ x }}
        animate={controls}
        onDrag={handleDrag}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {<SwipeOptionContainer isSwiped={isSwiped}>{swipeOptionChildren}</SwipeOptionContainer>}
    </div>
  );
};

export default SwipeableItem;
