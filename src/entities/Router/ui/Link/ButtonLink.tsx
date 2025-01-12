"use client";

import { useLinkHref } from "@/shared/hooks";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import React, { ComponentProps } from "react";
import { rawButtonVariants } from "../../../../shared/ui/Button/style";
import { cn } from "@/shared/utils";
import { Motion } from "../../../../shared/ui/animation/animation";

const ButtonLink = (
  props: ComponentProps<typeof Link> & {
    wrapperClassName?: string;
    href?: string;
    subDomain?: string;
    custom?: boolean;
  } & VariantProps<typeof rawButtonVariants>
) => {
  const { href = "", subDomain: _subDomain, custom = false, className, ...rest } = props;
  const linkHref = useLinkHref(props);

  const handleButtonClick = () => {
    // @ts-ignore
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <Motion
      componentType={"div"}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", duration: 0.25 }}
      className={props.wrapperClassName ?? ""}
    >
      <Link {...rest} className={cn(rawButtonVariants(rest), className)} href={linkHref!} onClick={handleButtonClick} />
    </Motion>
  );
};

export default ButtonLink;
