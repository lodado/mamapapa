import { Selection } from "prosemirror-state";

/**
 * Checks if the current selection is entirely within a single node.
 * @param selection - The current editor selection.
 * @returns True if the selection is within a single node, false otherwise.
 */
export function isSelectionWithinSingleNode(selection: Selection): boolean {
  return selection.$from.parent === selection.$to.parent;
}
