import { cva } from 'class-variance-authority'

export const rawButtonVariants = cva(`rounded-[4px] inline-flex justify-center items-center`, {
  variants: {
    variant: {
      primary: `bg-color-background-brand-bold-default text-background hover:bg-color-background-brand-bold-hovered active:bg-color-background-brand-bold-pressed
      border-2 border-transparent focus:border-solid focus-visible:border-color-background-input-default focus-visible:outline focus:outline-1 focus-visible:outline-color-border-bold
      disabled:opacity-20`,

      secondary: `bg-color-background-accent-gray-subtlest-default text-color-text-default hover:bg-color-background-accent-gray-subtlest-hovered active:bg-color-background-accent-gray-subtlest-pressed
      border-2 border-transparent focus:border-solid focus-visible:border-color-background-input-default focus-visible:outline focus:outline-1 focus-visible:outline-color-border-bold
      disabled:opacity-20`,

      text: `bg-transparent text-color-text-default hover:bg-color-background-input-hovered active:bg-color-background-input-pressed
      border-2 border-transparent focus:border-solid focus-visible:border-color-background-input-default focus-visible:outline focus:outline-1 focus-visible:outline-color-border-bold
      disabled:opacity-20`,

      outline: `bg-transparent text-color-text-default hover:bg-color-background-input-hovered active:bg-color-background-input-pressed
      border-2 border-color-border-input focus:border-solid focus-visible:border-color-background-input-default focus-visible:outline focus:outline-1 focus-visible:outline-color-border-bold
      disabled:opacity-20`,

      custom: "",
    },

    size: {
      medium: "gap-1 body-01",
      large: "gap-2 heading-03",
      small: "gap-1 body-03",
      custom: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export const buttonVariants = cva("", {
  variants: {
    size: {
      // primarymedium: 'h-9 px-spacing-3 py-spacing-1',
      // primarylarge: 'h-10 px-spacing-4 py-spacing-3',
      // primarysmall: 'h-6 px-spacing-2 py-spacing-1',

      medium: "h-9 px-2 py-2",
      large: "h-10 px-4 py-3",
      small: "h-6 px-2 py-1",
      custom: "",
    },
  },
  defaultVariants: {
    size: "medium",
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
