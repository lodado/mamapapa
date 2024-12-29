import "./globals.scss";
import "../shared/libs/Figma/index.scss";
 
import { PropsWithChildren } from "react";
import { i18nOption } from "@/shared";

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

export const metadata = {
  metadataBase: new URL(webUrl!),
  alternates: {
    canonical: "/en",
    languages: {
      ...i18nOption.locales
        .filter((ele) => ele !== "en")
        .reduce((total: any, ele) => {
          total[ele] = `/${ele}`;
          return total;
        }, {}),
    },
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return children;
}
