// app/repositories/ProseMirrorRepository.ts
import { ObjectId } from "mongodb";
import { EditorRepositoryImpl } from "../../core/repository";
import { EditorNode } from "../../core/entity";
import { mapEntityErrorToRepositoryError, RepositoryError } from "@/shared";
import mongoDbClient from "@/shared/libs/mongoDB/mongoDB";

const DOCUMENT_COLLECTION = "feature/editor/documents";

export default class EditorServerRepository implements EditorRepositoryImpl {
  constructor(private boardId: string) {}

  // Get a document by ID
  async getById({ id }: { id: string }): Promise<EditorNode> {
    try {
      const client = await mongoDbClient;
      const db = client.db(process.env.MONGODB_URL);
      const collection = db.collection(DOCUMENT_COLLECTION);

      const documentId = ObjectId.createFromHexString(id + this.boardId);
      const document = await collection.findOne({ _id: documentId });

      if (!document) {
        throw new RepositoryError({ message: "Document not found." });
      }

      return new EditorNode({ content: document.content });
    } catch (error) {
      throw mapEntityErrorToRepositoryError(error);
    }
  }

  // Update a document by ID
  async put({ id, node }: { id: string; node: EditorNode }): Promise<void> {
    try {
      const client = await mongoDbClient;
      const db = client.db(process.env.MONGODB_URL);
      const collection = db.collection(DOCUMENT_COLLECTION);

      const documentId = ObjectId.createFromHexString(id + this.boardId);
      const result = await collection.updateOne(
        { _id: documentId },
        { $set: { content: node.content, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        throw new RepositoryError({ message: "Failed to update the document." });
      }
    } catch (error) {
      throw mapEntityErrorToRepositoryError(error);
    }
  }

  // Delete a document by ID
  async deleteById({ id }: { id: string }): Promise<void> {
    try {
      const client = await mongoDbClient;
      const db = client.db(process.env.MONGODB_URL);
      const collection = db.collection(DOCUMENT_COLLECTION);

      const documentId = ObjectId.createFromHexString(id + this.boardId);
      const result = await collection.deleteOne({ _id: documentId });

      if (result.deletedCount === 0) {
        throw new RepositoryError({ message: `Failed to delete document with id ${id}.` });
      }
    } catch (error) {
      throw new RepositoryError({ message: `Error deleting document with id ${id}`, originalError: error });
    }
  }
}
