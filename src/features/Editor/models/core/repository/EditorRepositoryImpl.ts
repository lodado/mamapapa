import { ProseMirrorNode } from "../../editor";
import { EditorNode } from "../entity";

export interface EditorRepositoryImpl {
  getById: ({ id }: { id: string }) => Promise<EditorNode>;
  put({ id, node }: { id: string; node: EditorNode }): Promise<void>;
  deleteById: ({ id }: { id: string }) => Promise<void>;
}
