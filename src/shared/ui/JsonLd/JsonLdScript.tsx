import React from "react";

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
const baseUrl = webUrl ?? "";

const defaultImage = "/Logo.svg";

interface Metadata {
  title: string;
  description: string;
  author?: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  date?: string; // 추가된 속성
  isAccessibleForFree?: boolean;
  keywords?: string;
  image?: string;
  locale?: string;
}

interface JsonLdData {
  "@context": string;
  "@type": string;
  applicationCategory: string;
  name: string;
  description: string;
  author: {
    "@type": string;
    name: string;
  };
  keywords?: string;
  url: string;
  inLanguage?: string;
  datePublished: string;
  dateModified: string;
  isAccessibleForFree?: boolean;
  image: string;
  publisher: {
    "@type": string;
    name: string;
    logo: {
      "@type": string;
      url: string;
    };
  };
  operatingSystem: string;
  browserRequirements: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  potentialAction: {
    "@type": string;
    target: string;
    expectsAcceptanceOf: {
      "@type": string;
      price: string;
      priceCurrency: string;
    };
  };
}

// 기본 메타 데이터 (필요에 따라 실제 데이터로 교체)
const defaultMetadata: Metadata = {
  title: "Simmey Face Matching",
  description: "Use a face-matching AI to see how much you resemble your mom and dad!",
  url: "/",
  datePublished: new Date().toISOString(),
  isAccessibleForFree: true,
  keywords: "face matching, ai, fun, family",
  image: defaultImage,
};

/**
 * customMeta가 있을 경우 해당 값으로 덮어쓰고,
 * 그렇지 않으면 기본값을 사용하여 JSON‑LD 데이터를 생성합니다.
 */
const resolveAbsoluteUrl = (metadata: Metadata) => {
  if (/^https?:\/\//.test(metadata.url)) {
    return metadata.url;
  }

  const normalizedPath = metadata.url.startsWith("/") ? metadata.url : `/${metadata.url}`;
  const localePrefix = metadata.locale ? `/${metadata.locale}` : "";

  return `${baseUrl}${localePrefix}${normalizedPath}`;
};

const resolveImageUrl = (image?: string) => {
  if (!image) {
    return `${baseUrl}${defaultImage}`;
  }

  return /^https?:\/\//.test(image) ? image : `${baseUrl}${image}`;
};

export const generateJsonLd = (customMeta: Partial<Metadata> = {}): JsonLdData => {
  const metadata = { ...defaultMetadata, ...customMeta };
  const absoluteUrl = resolveAbsoluteUrl(metadata);
  const imageUrl = resolveImageUrl(metadata.image);

  const structuredData: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    applicationCategory: "EntertainmentApplication", // 엔터테인먼트 카테고리 지정
    name: metadata.title,
    description: metadata.description,
    author: {
      "@type": "Person",
      name: metadata.author ?? "lodado",
    },
    keywords: metadata.keywords ?? defaultMetadata.keywords,
    url: absoluteUrl,
    inLanguage: metadata.locale,
    datePublished: metadata.datePublished,
    dateModified: metadata.dateModified ?? metadata.date ?? metadata.datePublished,
    isAccessibleForFree: metadata.isAccessibleForFree,
    image: imageUrl,

    publisher: {
      "@type": "Organization",
      name: "lodado",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${defaultImage}`,
      },
    },

    operatingSystem: "ALL", // 모든 운영체제 지원
    browserRequirements: "A modern browser with JavaScript enabled", // JavaScript가 활성화된 최신 브라우저 지원
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    potentialAction: {
      "@type": "InteractAction",
      target: absoluteUrl,
      expectsAcceptanceOf: {
        "@type": "Offer",
        price: "0.00",
        priceCurrency: "USD",
      },
    },
  };

  return structuredData;
};

/**
 * JSON‑LD 데이터를 <script> 태그를 통해 head 또는 body에 삽입하는 컴포넌트
 */
interface JsonLdProps {
  customMeta?: Partial<Metadata>;
}

export const JsonLdScript = ({ customMeta }: JsonLdProps) => {
  const jsonLdData = generateJsonLd(customMeta);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />;
};
