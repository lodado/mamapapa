import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { GetEditorNodeUseCase } from "./../models/core/usecase/GetEditorNodeUseCase";
import { DeleteEditorNodeUseCase, EditorNode, UpdateEditorNodeUseCase } from "../models";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

export async function fetchDocument(id: string) {
  try {
    const editorRepository = new SERVER_DI_REPOSITORY.Editor(id);
    const authRepository = new EDGE_DI_REPOSITORY.Auth();

    const document = await new GetEditorNodeUseCase(editorRepository, authRepository).execute();
    return document;
  } catch (error) {
    console.error(error);
  }
}

export async function updateDocument(id: string, newNode: EditorNode) {
  try {
    const editorRepository = new SERVER_DI_REPOSITORY.Editor(id);
    const authRepository = new EDGE_DI_REPOSITORY.Auth();

    await new UpdateEditorNodeUseCase(editorRepository, authRepository).execute({ content: newNode.content });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteDocument(id: string) {
  try {
    const editorRepository = new SERVER_DI_REPOSITORY.Editor(id);
    const authRepository = new EDGE_DI_REPOSITORY.Auth();

    await new DeleteEditorNodeUseCase(editorRepository, authRepository).execute();
  } catch (error) {
    console.error(error);
  }
}
