import { Selection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { isRTL } from "./isRTL";

/**
 * Calculates the actual coordinates of a given position in the editor view.
 *
 * @param {Object} options - The options object.
 * @param {EditorView} options.view - The editor view.
 * @param {number} options.pos - The position in the editor.
 * @returns {Object} - The actual coordinates of the position.
 */
export const getActualCoord = ({ view, pos }: { view: EditorView; pos: number }) => {
  const coords = view.coordsAtPos(pos);
  const isDocumentRTL = isRTL();

  const actualCoords = isDocumentRTL
    ? {
        right: 0,
        top: coords.top + window.scrollY,
        left: 0,
        bottom: coords.bottom + window.scrollY,
      }
    : {
        left: coords.left + window.scrollX,
        top: coords.top + window.scrollY,
        right: coords.right + window.scrollX,
        bottom: coords.bottom + window.scrollY,
      };

  return actualCoords;
};

export const getRtlCoord = (
  view: EditorView,
  {
    newSelection,
    prevSelection,
  }: {
    newSelection: Selection;
    prevSelection: Selection;
  }
) => {
  // Detect text direction (LTR or RTL)
  const { from, to } = newSelection;

  const isRTL = window.getComputedStyle(document.body).direction === "rtl";

  // Get the bounding rectangle of the view.dom element
  // const viewDomRect = view.dom.getBoundingClientRect();
  const startCoords = view.coordsAtPos(Math.min(from, prevSelection.from));

  let yCoords = startCoords.top; // Adjust for page scroll
  let xCoords = startCoords.left; // Adjust for page scroll

  // If RTL, adjust xCoords by subtracting from the right side
  if (isRTL) {
    const startCoords = view.coordsAtPos(Math.max(to, prevSelection.to));
    xCoords = -startCoords.right;
  }

  return { xCoords, yCoords };
};

export const getNodeRelativeCoord = ({ view, pos }: { view: EditorView; pos: number }) => {
  const $pos = view.state.doc.resolve(pos);

  const coords = view.coordsAtPos(pos);
  const domNode = view.nodeDOM($pos.start());

  if (!(domNode instanceof HTMLElement)) return null;

  const domNodeRect = domNode.getBoundingClientRect();
  const editorRect = view.dom.getBoundingClientRect();

  const relativeLeft = domNodeRect.left + window.scrollX - editorRect.left;
  const relativeTop = domNodeRect.top + window.scrollY - editorRect.top;

  return { left: relativeLeft, top: relativeTop };
};
