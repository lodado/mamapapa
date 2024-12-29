// usecases/UpdateDomainUseCase.ts
import { UseCaseError } from "@/shared";
import { AuthRepositoryImpl } from "@/entities/Auth/core";
import { Domain, DomainRepositoryImpl } from "@/features/blog/domain/models/core";

export default class UpdateDomainUseCase {
  private domainRepository: DomainRepositoryImpl;
  private authRepository: AuthRepositoryImpl;

  constructor(domainRepository: DomainRepositoryImpl, authRepository: AuthRepositoryImpl) {
    this.domainRepository = domainRepository;
    this.authRepository = authRepository;
  }

  async execute(domainId: number, updates: Partial<Domain>): Promise<void> {
    try {
      // Authorization check
      const existingDomain = await this.domainRepository.getDomainById(domainId);

      if (!existingDomain) {
        throw new UseCaseError({ message: "Domain not found" });
      }

      if (existingDomain.userId !== (await this.authRepository.getUserInfo())?.id) {
        throw new UseCaseError({ message: "User is not authorized to update domain" });
      }

      // Update domain
      await this.domainRepository.updateDomain(domainId, updates);
    } catch (error) {
      throw new UseCaseError({ originalError: error });
    }
  }
}
