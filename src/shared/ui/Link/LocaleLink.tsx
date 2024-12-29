"use client";

import { useLinkHref } from "@/shared/hooks";
import Link from "next/link";
import React, { ComponentProps } from "react";

const LocaleLink = (props: ComponentProps<typeof Link> & { href?: string; subDomain?: string; custom?: boolean }) => {
  const { href = "", subDomain: _subDomain, custom = false, ...rest } = props;
  const linkHref = useLinkHref(props);

  return <Link {...rest} href={linkHref!} />;
};

export default LocaleLink;
