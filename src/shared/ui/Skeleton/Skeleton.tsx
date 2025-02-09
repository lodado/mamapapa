// Skeleton.tsx
import React from "react";

export interface SkeletonProps {
  /** "rect" (직사각형) 또는 "circle" (원형) */
  shape?: "rect" | "circle";

  /** 추가로 적용할 Tailwind CSS 클래스 */
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ shape = "rect", className = "" }) => {
  // shape에 따라 테두리 반경을 설정
  const borderRadiusClass = shape === "circle" ? "rounded-full" : "rounded";

  return (
    <div className={`relative overflow-hidden bg-tertiary-press animate-pulse ${borderRadiusClass} ${className}`} />
  );
};

export default Skeleton;
