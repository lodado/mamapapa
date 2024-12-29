"use client";

import React, { forwardRef, HTMLAttributes, InputHTMLAttributes, useEffect, useRef } from "react";

import { InputStyleVariants } from "./style";
import { cn } from "@/shared/utils";
import { useForkRef } from "@/shared/hooks";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;

  /** Additional CSS class name */
  className?: string;

  /** Whether the input field should be read-only */
  readOnly?: boolean;

  /** Whether the input field should be disabled */
  disabled?: boolean;

  /** Placeholder text for the input field */
  placeholder?: string;

  /** Data attribute indicating whether the input is invalid */
  "data-invalid"?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const { className, wrapperClassName, children, ...rest } = props;

  const dataInvalid = props["data-invalid"];
  const variant = dataInvalid ? "invalid" : "default";

  const defaultRef = useRef<HTMLInputElement>(null);
  const inputRef = useForkRef(ref, defaultRef);

  const scrollToTop = () => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    defaultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const handleBlur = () => {
      scrollToTop();
    };

    const inputElement = defaultRef.current;
    inputElement?.addEventListener("blur", handleBlur);

    // Cleanup event listeners on component unmount
    return () => {
      inputElement?.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className={cn("", wrapperClassName)}>
      <input ref={inputRef} className={cn(InputStyleVariants({ variant, size: "medium" }), className)} {...rest} />
      {children}
    </div>
  );
});

export default Input;
