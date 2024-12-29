import { EntityError } from "@/shared";
import { ProseMirrorNode } from "../../editor";

// ProseMirrorNode.ts
class EditorNode {
  content: ProseMirrorNode;

  constructor({ content }: { content: ProseMirrorNode }) {
    this.content = content;
    this.validate();
  }

  // Add validation logic if needed to check if the content follows ProseMirror structure
  validate(): boolean {
    if (!this.content || typeof this.content !== "object") {
      throw new EntityError({ message: "Content must be a valid ProseMirror node structure." });
    }
    return true;
  }

  // Example method to return ProseMirror content as JSON
  toJSON() {
    return this.content;
  }
}

export default EditorNode;
