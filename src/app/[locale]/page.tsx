import { getLinkHref } from "@/shared/api/getLinkHref";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  redirect(await getLinkHref({ subDomain: `www`, href: "/" }));
};

export default Page;
