import { mapRepositoryErrorToUseCaseError, RepositoryError } from "@/shared";
import { ProseMirrorNode } from "../../editor";
import { EditorNode } from "../entity";
import { EditorRepositoryImpl } from "../repository";
import { AuthRepositoryImpl } from "@/entities/Auth/core";

/**
 * Use case to update a ProseMirrorNode.
 */
export class UpdateEditorNodeUseCase {
  private editorRepository: EditorRepositoryImpl;
  private authRepository: AuthRepositoryImpl;

  constructor(EditorRepository: EditorRepositoryImpl, AuthRepository: AuthRepositoryImpl) {
    this.editorRepository = EditorRepository;
    this.authRepository = AuthRepository;
  }

  async execute({ content }: { content: ProseMirrorNode }): Promise<void> {
    try {
      const userEntity = await this.authRepository.getUserInfo();
      const id = userEntity?.id;

      if (!id) {
        throw new RepositoryError({ message: "User id is not found" });
      }

      const node = new EditorNode({ content });

      await this.editorRepository.put({ id, node });
    } catch (error) {
      throw mapRepositoryErrorToUseCaseError(error);
    }
  }
}
