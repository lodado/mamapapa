"use client";

import { motion, useAnimation, useMotionValue } from "motion/react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import { useSwipeContext } from "./SwipeableItemProvider";

interface SwipeableItemProps {
  // 아이템 식별용 id (옵션)
  itemId?: string;
  leftSwipeLimit?: number;
  children: React.ReactNode;
  swipeOptionChildren: React.ReactNode;
  onSwipeLeft?: () => void;
  // 다른 아이템 스와이프 시 자신의 상태를 리셋할지 여부
  resetOnOtherSwipe?: boolean;
}

export const SwipeOptionContainer = ({ isSwiped, children }: PropsWithChildren & { isSwiped: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isSwiped ? 1 : 0 }}
      transition={{ duration: 0 }}
      style={{ originX: 1 }}
      className="absolute right-0 top-0 inset-0 flex h-full justify-end items-center"
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
  resetOnOtherSwipe = false,
  itemId,
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);
  const { swipedItemId, setSwipedItemId } = useSwipeContext() ?? {
    swipedItemId: "-1",
    setSwipedItemId: () => {},
  };

  // 아이템 식별용 id, 제공되지 않으면 내부에서 랜덤 생성
  const idRef = useRef(itemId || Math.random().toString(36).substr(2, 9));

  // 전역 스와이프 상태가 바뀔 때, 자신이 스와이프 상태인데 다른 아이템이 스와이프되면 리셋
  useEffect(() => {
    if (resetOnOtherSwipe && swipedItemId !== idRef.current && isSwiped) {
      controls.start({ x: 0 });
      setIsSwiped(false);
    }
  }, [swipedItemId, resetOnOtherSwipe, isSwiped, controls]);

  const handleDrag = async (event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < leftSwipeLimit / 2) {
      await controls.start({ x: leftSwipeLimit });
      setIsSwiped(true);
      onSwipeLeft?.();
      if (resetOnOtherSwipe) {
        setSwipedItemId(idRef.current);
      }
    } else {
      await controls.start({ x: 0 });
      setIsSwiped(false);
      if (resetOnOtherSwipe && swipedItemId === idRef.current) {
        setSwipedItemId(null);
      }
    }
  };

  return (
    <div className="relative">
      <motion.div
        drag="x"
        dragConstraints={{ left: leftSwipeLimit, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        animate={controls}
        onDragEnd={handleDrag}
        className="relative z-[5]"
      >
        {children}
      </motion.div>

      <SwipeOptionContainer isSwiped={isSwiped}>{swipeOptionChildren}</SwipeOptionContainer>
    </div>
  );
};

export default SwipeableItem;
