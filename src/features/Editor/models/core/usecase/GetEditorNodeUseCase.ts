import { mapRepositoryErrorToUseCaseError, RepositoryError } from "@/shared";
import { EditorRepositoryImpl } from "../repository";
import { EditorNode } from "../entity";
import { AuthRepositoryImpl } from "@/entities/Auth/core";

/**
 * Use case to get a ProseMirrorNode.
 */
export class GetEditorNodeUseCase {
  private editorRepository: EditorRepositoryImpl;
  private authRepository: AuthRepositoryImpl;

  constructor(EditorRepository: EditorRepositoryImpl, AuthRepository: AuthRepositoryImpl) {
    this.editorRepository = EditorRepository;
    this.authRepository = AuthRepository;
  }

  async execute(): Promise<EditorNode> {
    try {
      const userEntity = await this.authRepository.getUserInfo();
      const id = userEntity?.id;

      if (!id) {
        throw new RepositoryError({ message: "User id is not found" });
      }

      return await this.editorRepository.getById({ id });
    } catch (error) {
      throw mapRepositoryErrorToUseCaseError(error);
    }
  }
}
