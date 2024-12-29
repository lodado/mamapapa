import { MARK_NONE_PRESENT, MARK_ALL_PRESENT, MARK_PARTIALLY_PRESENT } from "@/features/Editor/utils";
import { cva, VariantProps } from "class-variance-authority";

// CVA 설정: 각 상수 값에 따라 opacity를 지정
export const MarkSelection = cva("", {
  variants: {
    markState: {
      [MARK_ALL_PRESENT]: "text-color-background-accent-blue-bolder-default", // MARK_ALL_PRESENT일 때
      [MARK_PARTIALLY_PRESENT]: "text-background-inverse", // MARK_PARTIALLY_PRESENT일 때
      [MARK_NONE_PRESENT]: "text-background-inverse", // MARK_NONE_PRESENT일 때
    },
  },
  defaultVariants: {
    markState: MARK_NONE_PRESENT, // 기본 값
  },
});

export type MarkSelectionProps = VariantProps<typeof MarkSelection>;
