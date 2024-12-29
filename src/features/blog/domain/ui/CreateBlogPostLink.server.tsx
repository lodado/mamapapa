import { ServerLocaleLink } from "@/shared/ui/index.server";
import React from "react";

import { GetDomainByUserIdUseCase } from "../models";
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { SquarePen } from "lucide-react";
import { getTranslations } from "next-intl/server";

const CreateBlogPostLink = async () => {
  const t = await getTranslations("CreateBlogPostLink"); // Use the key prefix
  const domain = await new GetDomainByUserIdUseCase(
    new SERVER_DI_REPOSITORY.Domain(),
    new EDGE_DI_REPOSITORY.Auth()
  ).getDomainByUserId();

  const domainLocation = domain?.domainLocation;

  return (
    <>
      {domainLocation && (
        <ServerLocaleLink
          className="flex items-center w-[2.5rem] h-[2.5rem]"
          title={t("title")} // Referencing the translated title key
          subDomain={domainLocation}
          href={"/protected/create-blog-post"}
        >
          <SquarePen />
        </ServerLocaleLink>
      )}
    </>
  );
};

export default CreateBlogPostLink;
