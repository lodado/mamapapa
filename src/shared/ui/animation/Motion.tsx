"use client";

import { useIsClient } from "@/shared/hooks";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import React, { ComponentProps, PropsWithChildren, useEffect, useId, useState } from "react";
import { startTransition } from "react";

interface CustomMotionProps<Tag extends keyof JSX.IntrinsicElements> extends MotionProps {
  type?: Tag;
  children: React.ReactNode;
  className?: string;
}

export const AnimationRoot = ({ children, initial: _initial, ...rest }: ComponentProps<typeof AnimatePresence>) => {
  const [initial, setInitial] = useState(_initial ?? true);
  const isClient = useIsClient();
  const id = useId();

  useEffect(() => {
    if (isClient) {
      startTransition(() => setInitial(true));
    }
  }, []);

  return (
    <AnimatePresence key={id} {...rest} initial={initial}>
      {children}
    </AnimatePresence>
  );
};

export const Motion = <Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  className,
  ...props
}: CustomMotionProps<Tag>) => {
  const Component = type ? (motion as any)[type] : motion.div; // Using 'any' as a temporary workaround
  const id = useId();

  return (
    <Component key={id} className={className} {...props}>
      {children}
    </Component>
  );
};
