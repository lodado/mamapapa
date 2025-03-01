import { Metadata } from 'next'

import { i18nOption } from "@/shared/libs/i18n/lib/option";

interface MetadataProps {
  title: string;
  description: string;
  path: `/${string}`;
  image?: string;
  keywords: string;

  label1?: {
    name: string;
    data: string | number;
  };
  label2?: {
    name: string;
    data: string | number;
  };
  locale?: string;

  others?: {
    [key in string]: string;
  };
}

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

const defaultImage = "/Logo.svg";

export interface MetadataParams {
  params: {
    locale: string;
  };
}

export default function getMetadata(props: MetadataProps): Metadata {
  const { title, description: desc, path, image, keywords, label1, label2, others, locale = "KO" } = props;
  const description = `${desc}`;

  const images = webUrl + (image ?? defaultImage);

  return {
    icons: [
      { rel: "apple-touch-icon", url: "/Logo.svg" },
      { rel: "icon", url: "/Logo.svg" },
    ],

    metadataBase: new URL(webUrl!),

    title,
    description,
    openGraph: {
      title,
      description,
      url: webUrl + path,
      //  siteName: `${webUrl}`,
      images,
      locale,
      siteName: title,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    other: {
      "twitter:label1": label1?.name ?? "",
      "twitter:data1": label1?.data ?? "",
      "twitter:label2": label2?.name ?? "",
      "twitter:data2": label2?.data ?? "",

      keywords: keywords,
      robots: "index, follow",
      "naver-site-verification": "6b5e4679e9cb2d3e41ab048473812ee8dc051ad3",

      ...(others ?? {}),
    },

    alternates: {
      canonical: "/en" + path,
      languages: {
        ...i18nOption.locales
          .filter((ele) => ele !== "en")
          .reduce((total: any, locale) => {
            total[locale] = `/${locale}${path}`;
            return total;
          }, {}),
      },
    },
  };
}
