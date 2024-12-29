"use client";

import { AlertTriangle, Home } from "lucide-react";
import { Button, LocaleLink } from "@/shared/ui";
import { Navigation } from "@/widgets/index.server";
import { ServerLocaleLink } from "@/shared/ui/index.server";
import { useTranslations } from "next-intl";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

export default function ErrorPage({ error = undefined }: { error?: string }) {
  const t = useTranslations("errorpage");
  const subDomain = "www";

  return (
    <>
      <Navigation.Root>
        <Navigation.Header />
        <Navigation.Footer authRepository={new EDGE_DI_REPOSITORY.Auth()} />
      </Navigation.Root>
      <main className="flex page-content flex-col items-center justify-center p-4 text-center">
        <div className="w-full flex flex-col items-center max-w-md">
          <div className="flex flex-col w-full justify-center items-center mb-4">
            <div className="flex flex-row w-full justify-center items-center h-[4rem] mb-10">
              <AlertTriangle className="mx-auto text-color-text-danger" size={100} aria-hidden="true" />
            </div>

            <h1 className="font-bold text-color-text-default heading-01">{t("title")}</h1>
            <p className="text-base text-color-icon-default body-01 " role="alert">
              {error || t("defaultError")}
            </p>
          </div>
          <div className="flex justify-center">
            <Button type="button" variant="primary" className="w-max px-10 inline-flex items-center space-x-2">
              <ServerLocaleLink subDomain={subDomain} href="/" className="flex flex-row items-center gap-2">
                <Home className="w-5" aria-hidden="true" />
                <span>{t("returnHome")}</span>
              </ServerLocaleLink>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
