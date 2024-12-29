import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { GetDomainByUserIdUseCase } from "@/features/blog/domain/models/core/usecase";

import { CreateDomainPage } from "@/homepages/create-domain/index.server.";

import i18nOption, { LANGUAGE_LIST } from "@/shared/libs/i18n/lib/option";
import { redirect } from "next/navigation";
import React from "react";

import { getLinkHref } from "@/shared";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

/** 필요없으므로 지울것
export async function generateMetadata() {
  return {
    title: "Create Domain",
    description: "Create a new domain for your project.",

    alternates: {
      canonical: "/en" + "/create-blog",
      languages: {
        ...i18nOption.locales
          .filter((ele) => ele !== "en")
          .reduce((total: any, ele) => {
            total[ele] = `/${ele}` + "/create-blog";
            return total;
          }, {}),
      },
    },
  };
} 
*/
const Page = async () => {
  const UserCreatedDomain = await new GetDomainByUserIdUseCase(
    new SERVER_DI_REPOSITORY.Domain(),
    new EDGE_DI_REPOSITORY.Auth()
  ).getDomainByUserId();

  const isAlreadyUserCreatedDomain = !!UserCreatedDomain;

  if (isAlreadyUserCreatedDomain) {
    const subDomainLocation = UserCreatedDomain.domainLocation;

    redirect(await getLinkHref({ subDomain: `${subDomainLocation}`, href: "/" }));
  }

  return (
    <>
      <div className="w-full page-content flex justify-center">
        <CreateDomainPage />
      </div>
    </>
  );
};

export default Page;
