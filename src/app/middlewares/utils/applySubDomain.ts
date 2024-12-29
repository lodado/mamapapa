import { NEXT_FOLDER_LIST } from "@/app/[locale]/folderList";
import { LANGUAGE_LIST } from "@/shared/libs/i18n/lib/option";
 
import { NextRequest, NextResponse } from "next/server";

const HEADER_LOCALE_NAME = "X-NEXT-INTL-LOCALE";

export const extractLanguageFromUrl = (url: string): string => {
  const pathSegments = url.split("/");

  // LANGUAGE_LIST에 포함되지 않은 pathSegments만 필터링하여 반환
  const filteredSegments = pathSegments.filter((segment) => !LANGUAGE_LIST.includes(segment as any));

  // 필터링된 결과가 있을 경우 반환, 없으면 null 반환
  return filteredSegments.join("/");
};

/**
 * next-intl v3.20.0에서 발췌 및 수정
 * 단순히 NextResponse.rewrite 를 써서는 next-intl가 적용 안되어
 * 수정함
 * 2024-10-04
 */
export function applySubDomain(request: NextRequest, response: NextResponse) {
  const url = response.url;
  const locale = response.headers.get("x-middleware-request-x-next-intl-locale") ?? "en";
  const hostname = request.headers.get("host")!;

  /**
   * localhost일 경우엔 subdomain끼리 쿠키 공유가 안되서
   * localhost(dev mode)일떄는 일반 경로대로 처리
   */
  if (hostname.startsWith("localhost")) return response;

  const headers = new Headers(request.headers);
  headers.set(HEADER_LOCALE_NAME, locale);

  const searchParams = request.nextUrl.searchParams.toString();
  const requestUrl = request.nextUrl;

  const path = `${requestUrl.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const subDomain = hostname.split(".")[0];

  let parsedURL = `${extractLanguageFromUrl(path)}`;

  if (subDomain !== hostname) {
    parsedURL = `${locale ?? "en"}/${subDomain}` + parsedURL;

    return NextResponse.rewrite(new URL(request.nextUrl.origin + `/${parsedURL}`), {
      request: { headers },
    });
  }

  console.log("shit!");

  if (NEXT_FOLDER_LIST.includes(extractLanguageFromUrl(path))) return response;

  return NextResponse.rewrite(new URL(request.nextUrl.origin), {
    request: { headers },
  });
}
