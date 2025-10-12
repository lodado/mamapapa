import { i18nOption } from "@/shared";

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL!;
const defaultImage = "/Logo.svg";

export const PAGE_ROUTE = {
  MAIN: "/",
  FACES: "/faces",
  FACES_CELEBRITY: "/faces/celebrity",
} as const;

const PAGE_PRIORITIES = {
  MAIN: 1.0,
  FACES: 0.8,
  FACES_CELEBRITY: 1.0,
} as const;

const modificationDate = new Date();

export default function sitemap() {
  return [
    ...Object.entries(PAGE_ROUTE).map(([key, path]) => {
      return {
        url: webUrl + path,
        lastModified: modificationDate,
        changeFrequency: "monthly" as const,
        priority: PAGE_PRIORITIES[key as keyof typeof PAGE_PRIORITIES] || 0.5,

        alternates: {
          languages: {
            ...i18nOption.locales.reduce((total: any, locale) => {
              total[locale] = `${webUrl}/${locale}${path}`;
              return total;
            }, {}),
          },
        },
      };
    }),
  ];
}
