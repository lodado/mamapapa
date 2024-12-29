import { mapRepositoryErrorToUseCaseError, RepositoryError } from "@/shared";
import { ProseMirrorNode } from "../../editor";
import { EditorNode } from "../entity";
import { EditorRepositoryImpl } from "../repository";
import { AuthRepositoryImpl } from "@/entities/Auth/core";

/**
 * Use case to delete a ProseMirrorNode.
 */
export class DeleteEditorNodeUseCase {
  private editorRepository: EditorRepositoryImpl;
  private authRepository: AuthRepositoryImpl;

  constructor(EditorRepository: EditorRepositoryImpl, AuthRepository: AuthRepositoryImpl) {
    this.editorRepository = EditorRepository;
    this.authRepository = AuthRepository;
  }

  async execute(): Promise<void> {
    try {
      const userEntity = await this.authRepository.getUserInfo();
      const id = userEntity?.id;

      if (!id) {
        throw new RepositoryError({ message: "User id is not found" });
      }

      await this.editorRepository.deleteById({ id });
    } catch (error) {
      throw mapRepositoryErrorToUseCaseError(error);
    }
  }
}
