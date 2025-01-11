"use client";

import { useLinkHref } from "@/shared/hooks";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import React, { ComponentProps } from "react";
import { rawButtonVariants } from "../Button/style";
import { cn } from "@/shared/utils";

const LocaleLink = (
  props: ComponentProps<typeof Link> & { href?: string; subDomain?: string; custom?: boolean } & VariantProps<
      typeof rawButtonVariants
    >
) => {
  const { href = "", subDomain: _subDomain, custom = false, className, ...rest } = props;
  const linkHref = useLinkHref(props);

  return <Link {...rest} className={cn(rawButtonVariants(rest), className)} href={linkHref!} />;
};

export default LocaleLink;
