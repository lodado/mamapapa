import { LANGUAGE_LIST } from "@/shared";

export default class Domain implements Domain {
  domainId?: number;
  domainName: string;
  domainLocation: string;

  userId: string;

  description?: string;
  createdTime?: Date | number;
  language: (typeof LANGUAGE_LIST)[number];
  image?: string;

  constructor({ domainId, domainName, domainLocation, description, userId, language, image, createdTime }: Domain) {
    this.domainId = domainId;
    this.domainName = domainName;
    this.domainLocation = domainLocation;

    this.userId = userId;
    this.createdTime = createdTime;

    this.description = description;
    this.language = language;
    this.image = image;
  }
}
