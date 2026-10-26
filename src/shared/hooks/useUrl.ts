"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

export type MetadataParams = {
  locale: string;
  subDomain?: string;
};

const useUrl = <T extends Record<string, string | string[] | undefined> = MetadataParams>() => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const query = useSearchParams();
  const params = useParams<T>();

  const isSameUrl = (comparedPath: string) => {
    const nextPathWithoutLocale = `./${pathname.split("/").slice(2).join("/")}`;

    return comparedPath === nextPathWithoutLocale;
  };

  const push = (newPath: string) => {
    router.push(newPath);
  };

  return { isSameUrl, pathname, locale, push, query, params };
};

export default useUrl;
