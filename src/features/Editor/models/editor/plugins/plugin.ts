import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Schema } from "prosemirror-model";

import { WidgetController } from "../../../ui/components";
import { BlockDnDHighlightPlugin } from "./highlightPlugin";
import { saveDocument } from "./utils/saveDocument";
import { _NodeController } from "../nodes/NodeController";
import { _MarkController } from "../marks/MarkController";

export const createPlugin = (
  schema: Schema,
  widgetController: WidgetController,
  NodeController: _NodeController,
  MarkController: _MarkController
) => {
  return [
    ...widgetController.getPlugins(),
    ...NodeController.getPlugins(schema),
    ...MarkController.getPlugins(schema),
    keymap({
      ...baseKeymap,
      "Mod-z": undo,
      "Mod-Shift-z": redo, // Redo command for Mac
      "Mod-y": redo,
      "Mod-s": saveDocument,
    }),

    history(),
    gapCursor(),

    dropCursor({
      width: 4,
      color: "var(--Color-Background-Accent-Blue-Subtler-Default)",
    }),

    BlockDnDHighlightPlugin,
  ];
};
