import { cva } from 'class-variance-authority'

export const InputStyleVariants = cva(
  `flex px-3 items-center gap-3 rounded border border-solid body-01
  bg-background border-color-border-input hover:bg-color-background-input-hovered active:bg-color-background-input-pressed focus-within:outline 
        focus-within:outline-2 focus-within:outline-color-text-brand disabled:bg-color-text-disabled
        disabled:opacity-50 disabled:cursor-not-allowed
  
  `,
  {
    variants: {
      variant: {
        default: `read-only:bg-color-text-brand
      `,
        invalid: `border-color-text-danger focus-within:outline-2 focus-within:outline-color-text-danger`,
      },

      size: {
        textArea: "h-20",
        medium: " w-full h-[2rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
);
