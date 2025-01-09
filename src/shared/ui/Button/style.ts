import { cva } from 'class-variance-authority'

export const rawButtonVariants = cva(
  `rounded-[0.75rem] select-none touch-none flex h-14 py-2 px-4 justify-center items-center gap-0.5 head-3 flex-shrink-0 self-stretch `,
  {
    variants: {
      variant: {
        solid: "rounded-[0.75rem] bg-primary-01 text-text-00 active:bg-primary-01-press",
        line: "border border-solid border-primary-01 bg-transparent active:bg-primary-01-line-press text-text-primary",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);

export const buttonVariants = cva("", {
  variants: {
    size: {
      // primarymedium: 'h-9 px-spacing-3 py-spacing-1',
      // primarylarge: 'h-10 px-spacing-4 py-spacing-3',
      // primarysmall: 'h-6 px-spacing-2 py-spacing-1',
      custom: "",
    },
  },
  defaultVariants: {
    size: "custom",
  },
});

export const iconButtonVariants = cva("", {
  variants: {
    size: {
      medium: "p-2",
      large: "p-2",
      small: "p-1",
      custom: "",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const LeftButtonIconVariants = cva(``, {
  variants: {
    size: {
      medium: "[&>svg]:w-5 [&>svg]:h-5",
      large: "[&>svg]:w-6 [&>svg]:h-6",
      small: "[&>svg]:w-5 [&>svg]:h-5",
      custom: "",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const RightButtonIconVariants = cva(``, {
  variants: {
    size: {
      medium: "[&>svg]:w-3 [&>svg]:h-3",
      large: "[&>svg]:w-4 h-4",
      small: "[&>svg]:w-3 [&>svg]:h-3",
      custom: "",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
