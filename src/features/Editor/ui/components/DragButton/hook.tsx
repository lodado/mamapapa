import { ProseMirrorNode } from "@/features/Editor/models";
import { renderNodeToHTML } from "@/features/Editor/models/editor/nodes/utils";
import { Fragment } from "prosemirror-model";
import { ReactNode, useState } from "react";

type FragmentToReactNodeProps = {
  fragment: Fragment;
};

const FragmentToReactNode = ({ content }: { content: ProseMirrorNode | null }): ReactNode => {
  if (!content) return null;

  return <div dangerouslySetInnerHTML={{ __html: renderNodeToHTML(content) }} />;
};

export const useNodeDnDPlaceHolder = () => {
  const [placeholderPos, setPlaceholderPos] = useState({ x: 0, y: 0 });
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [nodeContent, setNodeContent] = useState<ReactNode>(null);

  const handleNodeContent = (content: ProseMirrorNode | null) => {
    if (content === null) {
      setNodeContent(null);

      return;
    }

    setNodeContent(FragmentToReactNode({ content }));
  };

  const handlePlaceholderPos = ({ x, y }: { x: number; y: number }) => {
    setPlaceholderPos({ x, y });
  };

  const handleShowPlaceholder = (flag: boolean) => {
    setShowPlaceholder(flag);
  };

  return {
    placeholderPos,
    showPlaceholder,
    nodeContent,
    handleNodeContent,
    handlePlaceholderPos,
    handleShowPlaceholder,
  };
};
