import { getTranslations } from "next-intl/server";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";

export interface SitelinkItem {
  name: string;
  url: string;
  description: string;
}

/**
 * 다국어 지원 sitelinks 데이터를 생성하는 함수
 * @param locale - 현재 언어 코드
 * @returns SitelinkItem 배열
 */
export async function generateSitelinks(locale: string): Promise<SitelinkItem[]> {
  const tSitelinks = await getTranslations("SITELINKS");

  return [
    {
      name: tSitelinks("MAIN.name"),
      url: PAGE_ROUTE.MAIN,
      description: tSitelinks("MAIN.description"),
    },
    {
      name: tSitelinks("FACES.name"),
      url: PAGE_ROUTE.FACES,
      description: tSitelinks("FACES.description"),
    },
    {
      name: tSitelinks("CELEBRITY.name"),
      url: PAGE_ROUTE.FACES_CELEBRITY,
      description: tSitelinks("CELEBRITY.description"),
    },
    {
      name: tSitelinks("HISTORY.name"),
      url: PAGE_ROUTE.HISTORY_LIST,
      description: tSitelinks("HISTORY.description"),
    },
  ];
}
