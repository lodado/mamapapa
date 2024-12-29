// usecases/DeleteDomainUseCase.ts
import { UseCaseError } from "@/shared";
import { AuthRepositoryImpl } from "@/entities/Auth/core";
import { DomainRepositoryImpl } from "@/features/blog/domain/models/core";

export default class DeleteDomainUseCase {
  private domainRepository: DomainRepositoryImpl;
  private authRepository: AuthRepositoryImpl;

  constructor(domainRepository: DomainRepositoryImpl, authRepository: AuthRepositoryImpl) {
    this.domainRepository = domainRepository;
    this.authRepository = authRepository;
  }

  async execute(domainId: number): Promise<void> {
    try {
      // Authorization check
      const existingDomain = await this.domainRepository.getDomainById(domainId);

      if (!existingDomain) {
        throw new UseCaseError({ message: "Domain not found" });
      }

      if (existingDomain.userId !== (await this.authRepository.getUserInfo())?.id) {
        throw new UseCaseError({ message: "User is not authorized to delete domain" });
      }

      // Delete domain
      await this.domainRepository.deleteDomain(domainId);
    } catch (error) {
      throw new UseCaseError({ originalError: error });
    }
  }
}
