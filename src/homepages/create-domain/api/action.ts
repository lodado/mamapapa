"use server";;
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
 
import { Domain } from "@/features/blog/domain/models/core";
import { CreateDomainUseCase, GetDomainUseCase } from "@/features/blog/domain/models/core/usecase";
import { redirect } from "next/navigation";
import { getLinkHref } from "@/shared/api";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

export async function createBlogAction(formData: FormData) {
  const domainLocation = formData.get("subdomain") as string;
  const userId = formData.get("userId") as string;
  const domainName = formData.get("blogTitle") as string;
  const description = formData.get("blogDescription") as string;
  const language = formData.get("mainLanguage") as Domain["language"];
  const image = formData.get("ogImage") as File | null;

  const imageLink = "https://www.example.com/image.jpg";

  const domain = new Domain({ domainName, domainLocation, description, userId, language, image: imageLink });

  await new CreateDomainUseCase(new SERVER_DI_REPOSITORY.Domain(), new EDGE_DI_REPOSITORY.Auth()).execute(domain);

  redirect(await getLinkHref({ subDomain: `${domainLocation}`, href: "/" }));
}

export async function isDomainAddressAlreadyRegistered(domainAddress: string) {
  const flag = await new GetDomainUseCase(new SERVER_DI_REPOSITORY.Domain()).getDomainByDomainAddress(domainAddress);

  return flag;
}
