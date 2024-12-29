import { useEditorContext } from "@/features";

import { isSelectionWithinSingleNode } from "@/features/Editor/utils";
import { toggleMark } from "prosemirror-commands";
import React from "react";

const useNodeCommand = () => {
  const { view, MarkController } = useEditorContext();
  const marks = MarkController.marks;

  const isSelectionWithinNode = () => {
    return isSelectionWithinSingleNode(view?.state.selection);
  };

  const toggleMarkCommand = (markType: keyof typeof marks) => () => {
    const { state, dispatch } = view;
    const command = toggleMark(marks[markType].type);

    if (command(state, dispatch)) {
      view.focus();
    }
  };

  return { isSelectionWithinNode, toggleMarkCommand };
};

export default useNodeCommand;
