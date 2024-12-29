import { DOMSerializer } from "prosemirror-model";
import { ProseMirrorNode } from "../../types";
import { getSanitizeHTML } from "@/shared/libs/sanitize/sanitizeHTML";

export function renderNodeToHTML(node: ProseMirrorNode): string {
  const div = document.createElement("div");

  // ProseMirror DOMSerializer로 직접 변환
  const serializer = DOMSerializer.fromSchema(node.type.schema);
  const fragment = node.content;

  fragment.forEach((child) => {
    // `child`의 타입을 명확하게 지정하고 DOMSerializer를 사용
    const domNode = serializer.serializeNode(child);
    if (domNode) {
      div.appendChild(domNode);
    }
  });

  const rawHtml = div.innerHTML;

  const cleanHtml = getSanitizeHTML(rawHtml);

  return cleanHtml;
}
