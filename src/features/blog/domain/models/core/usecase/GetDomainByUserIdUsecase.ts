// usecases/GetDomainUseCase.ts
import { UseCaseError } from "@/shared";
import { Domain, DomainRepositoryImpl } from "@/features/blog/domain/models/core";
import { AuthRepositoryImpl } from "@/entities/Auth/core";
 
export default class GetDomainByUserIdUseCase {
  private DomainRepository: DomainRepositoryImpl;
  private AuthRepository: AuthRepositoryImpl;

  constructor(DomainRepositoryImpl: DomainRepositoryImpl, AuthRepositoryImpl: AuthRepositoryImpl) {
    this.DomainRepository = DomainRepositoryImpl;
    this.AuthRepository = AuthRepositoryImpl;
  }

  async getDomainByUserId(): Promise<Domain | null> {
    try {
      // Fetch domain by ID

      const userId = (await this.AuthRepository.getUserInfo())?.id!;

      if (!userId) {
        return null;
      }

      const domain = await this.DomainRepository.getDomainByUserId(userId);

      return domain;
    } catch (error) {
      throw new UseCaseError({ message: "Failed to execute GetDomainUseCase", originalError: error });
    }
  }
}
