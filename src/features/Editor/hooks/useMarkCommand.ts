import { useEditorContext } from "@/features";
import { useEditorDispatch, useEditorSelector } from "@/features/Editor/hooks";
import { checkMarkInSelection, isSelectionWithinSingleNode } from "@/features/Editor/utils";
import { toggleMark } from "prosemirror-commands";
import { FORCE_RERENDER_EDITOR_MARK_TOOLTIP } from "../ui/components/MarkTooltip/model";

const useMarkCommand = () => {
  const { view, MarkController } = useEditorContext();
  const marks = MarkController.marks;

  const forceRenderObserver = useEditorSelector((state) => state.markToolTip.forceRender);
  const editorDispatch = useEditorDispatch();

  const isSelectionWithinNode = () => {
    return isSelectionWithinSingleNode(view?.state.selection);
  };

  const hasMarkInSelection = (markType: keyof typeof marks) => {
    const { state } = view;

    return checkMarkInSelection(state, marks[markType].type);
  };

  const toggleMarkCommand =
    <KEY extends keyof typeof marks>(markType: KEY, attr?: (typeof marks)[KEY]["defaultOptions"]) =>
    () => {
      const { state, dispatch } = view;

      const command = toggleMark(marks[markType].type, attr ?? marks[markType].defaultOptions, {
        removeWhenPresent: false,
      });

      if (command(state, dispatch)) {
        view.focus();
        editorDispatch(FORCE_RERENDER_EDITOR_MARK_TOOLTIP());
      }
    };

  return { forceRenderObserver, isSelectionWithinNode, hasMarkInSelection, toggleMarkCommand };
};

export default useMarkCommand;
