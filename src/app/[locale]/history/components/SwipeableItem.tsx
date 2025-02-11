import { motion, useAnimation, useMotionValue } from "framer-motion";
import { throttle } from "lodash-es";
import React, { useEffect, useMemo, useState } from "react";

interface SwipeableItemProps {
  leftSwipeLimit?: number;
  children: React.ReactNode;
  onSwipeLeft: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ leftSwipeLimit = -50, children, onSwipeLeft }) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);

  // throttle 내부적으로 적용
  const handleDrag = async (event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < leftSwipeLimit) {
      await controls.start({ x: leftSwipeLimit });
      setIsSwiped(true);
      onSwipeLeft();
    } else {
      controls.start({ x: 0 });
      setIsSwiped(false);
    }
  };

  return (
    <div className="relative" style={{ touchAction: "none" }}>
      <div className="absolute inset-0 flex justify-end items-center pr-4">
        {isSwiped && <button className="bg-red-500 text-white p-2 rounded">Button</button>}
      </div>
      {children}
      <motion.div
        drag="x"
        dragConstraints={{ left: leftSwipeLimit, right: 0 }}
        style={{ x }}
        animate={controls}
        onDrag={handleDrag}
        className="absolute w-full h-full bg-red-100 opacity-50 top-0 z-10"
      ></motion.div>
    </div>
  );
};

export default SwipeableItem;
