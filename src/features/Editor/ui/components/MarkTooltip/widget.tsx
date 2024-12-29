import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import React from "react";

import Widget from "../Widget";
import { OPEN_EDITOR_MARK_TOOLTIP, RESET_EDITOR_MARK_TOOLTIP } from "./model";
import { EditorMarkTooltip } from "./ui";
import { MARGIN_LEFT_EDITOR } from "@/features/Editor/constants";
import { EditorView } from "prosemirror-view";
import { getRtlCoord } from "@/features/Editor/utils";

export default class EditorMarkTooltipWidget extends Widget {
  render() {
    return <EditorMarkTooltip />;
  }

  plugin() {
    const widgetInstance = this;
    let initialSelection: { from: number; to: number } | null = null;

    return [
      new Plugin({
        key: new PluginKey("selection-change"),
        view: (view) => {
          return {
            update: (view: EditorView, prevState: EditorState) => {
              const { state } = view;
              if (!prevState) {
                prevState = state;
              }
              const prevSelection = prevState.selection;
              const newSelection = state.selection;

              if (!prevSelection.eq(newSelection)) {
                // Selection has changed
                const { from, to } = newSelection;

                if (from !== to) {
                  if (!initialSelection) {
                    initialSelection = { from, to };
                  }

                  const { xCoords, yCoords } = getRtlCoord(view, { newSelection, prevSelection });

                  // Dispatch an action with the coordinates of the selection
                  widgetInstance.debouncedDispatch(
                    OPEN_EDITOR_MARK_TOOLTIP({
                      x: xCoords,
                      y: yCoords,
                    })
                  );
                } else {
                  initialSelection = null;
                  widgetInstance.debouncedDispatch(RESET_EDITOR_MARK_TOOLTIP());
                }
              }
            },
          };
        },
      }),
    ];
  }
}
