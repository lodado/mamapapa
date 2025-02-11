import { motion } from "framer-motion";
import React, { useState } from "react";

interface SwipeableItemProps {
  leftSwipeLimit?: number; // 예: -50 (왼쪽으로 50px 이상 이동해야 스와이프로 간주)
  children: React.ReactNode;
  onSwipeLeft: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ leftSwipeLimit = -50, children, onSwipeLeft }) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  return (
    <motion.div
      style={{ touchAction: "none" }}
      onPanStart={(event, info) => {
        // 팬 시작 시 시작 x 좌표를 기록합니다.
        setStartX(info.point.x);
      }}
      onPanEnd={(event, info) => {
        if (startX !== null) {
          // 팬 종료 시 최종 좌표와 시작 좌표의 차이를 계산합니다.
          const deltaX = info.point.x - startX;
          // deltaX가 leftSwipeLimit (예: -50)보다 작으면 스와이프한 것으로 간주합니다.
          if (deltaX < leftSwipeLimit) {
            onSwipeLeft();
            setIsSwiping(true);
          } else {
            setIsSwiping(false);
          }
        }
        setStartX(null);
      }}
    >
      {isSwiping && (
        <button type="button" className="w-[100px] h-[100px]">
          삭제
        </button>
      )}
      {children}
    </motion.div>
  );
};

export default SwipeableItem;
