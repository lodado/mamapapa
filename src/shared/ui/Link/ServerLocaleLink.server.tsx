import { getLinkHref } from "@/shared/api";
import { useLinkHref } from "@/shared/hooks";
import Link from "next/link";
import React, { ComponentProps } from "react";

const ServerLocaleLink = async (
  props: ComponentProps<typeof Link> & { href?: string; subDomain?: string; custom?: boolean }
) => {
  const { href = "", subDomain: _subDomain, custom = false, ...rest } = props;
  const linkHref = await getLinkHref(props);

  return <Link {...rest} href={linkHref!} />;
};

export default ServerLocaleLink;
