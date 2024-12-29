import { UseCaseError } from "@/shared";

import { AuthRepositoryImpl } from "@/entities/Auth/core";
import { Domain, DomainRepositoryImpl } from "@/features/blog/domain/models/core";

export default class CreateDomainUseCase {
  private DomainRepository: DomainRepositoryImpl;
  private AuthRepository: AuthRepositoryImpl;

  constructor(DomainRepositoryImpl: DomainRepositoryImpl, AuthRepositoryImpl: AuthRepositoryImpl) {
    this.DomainRepository = DomainRepositoryImpl;
    this.AuthRepository = AuthRepositoryImpl;
  }

  async execute(domain: Domain): Promise<void> {
    try {
      if (domain.userId !== (await this.AuthRepository.getUserInfo())?.id) {
        throw new UseCaseError({ message: "User is not authorized to add domain" });
      }

      await this.DomainRepository.createDomain(domain);
    } catch (error) {
      throw new UseCaseError({ message: "Failed to execute AddDomainUseCase", originalError: error });
    }
  }
}
