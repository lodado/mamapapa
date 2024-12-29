import { DataWithTimestamp, IndexedDBController, mapEntityErrorToRepositoryError, RepositoryError } from "@/shared";
import { EditorRepositoryImpl } from "../../core/repository";
import { EditorNode } from "../../core/entity";

export class EditorIndexedDBRepository implements EditorRepositoryImpl {
  private indexedDBController: IndexedDBController;

  constructor(dbName: string = "pokitokiEditorDB", version: number = 1) {
    this.indexedDBController = new IndexedDBController(dbName, version);
  }

  async put({ id, node }: { id: string; node: EditorNode }): Promise<void> {
    const timestamp = Date.now();
    const data: DataWithTimestamp = {
      id,
      timestamp,
      content: node.content,
    };
    try {
      await this.indexedDBController.put(data);
    } catch (error) {
      throw new Error("Failed to store the editor node");
    }
  }

  async getById({ id }: { id: string }): Promise<EditorNode> {
    try {
      const result = (await this.indexedDBController.read({ id })) as DataWithTimestamp;

      if (!result) throw new RepositoryError({ message: "not registered any Editor context before" });

      const node = new EditorNode({ content: result.content });

      return node;
    } catch (error) {
      throw mapEntityErrorToRepositoryError(error);
    }
  }

  async deleteById({ id }: { id: string }): Promise<void> {
    try {
      await this.indexedDBController.delete({ id });
    } catch (error) {
      throw new Error("Failed to delete the editor node");
    }
  }
}
