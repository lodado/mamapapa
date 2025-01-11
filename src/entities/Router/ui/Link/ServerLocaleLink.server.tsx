import { getLinkHref } from "@/shared/api";

import { cn } from "@/shared/utils";
import Link from "next/link";
import React, { ComponentProps } from "react";
import { buttonVariants, rawButtonVariants } from "../../../../shared/ui/Button/style";
import { ButtonProps } from "../../../../shared/ui/Button/type";
import { VariantProps } from "class-variance-authority";

const ServerLocaleLink = async (
  props: ComponentProps<typeof Link> & { href?: string; subDomain?: string; custom?: boolean }
) => {
  const { href = "", subDomain: _subDomain, custom = false, className, ...rest } = props;
  const linkHref = await getLinkHref(props);

  return <Link {...rest} className={cn(className)} href={linkHref!} />;
};

export default ServerLocaleLink;
