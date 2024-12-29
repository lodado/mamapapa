import { Plugin, PluginKey } from "prosemirror-state";
import React from "react";

import Widget from "../Widget";
import { EDITOR_DROPDOWN_OPEN } from "./model";

import { EditorDropdown } from "./ui";

export default class EditorDropdownWidget extends Widget {
  render() {
    return <EditorDropdown />;
  }

  plugin() {
    return [
      new Plugin({
        key: new PluginKey("menu-dropdown"),
        props: {
          handleDoubleClick: (view, pos) => {
            const { doc, tr } = view.state;
            const $pos = doc.resolve(pos);
            const node = $pos.nodeAfter;

            if (node) {
              const coords = view.coordsAtPos(pos);
              this.store.dispatch(EDITOR_DROPDOWN_OPEN({ x: coords.left, y: coords.bottom }));
            }
            return false;
          },
        },
      }),
    ];
  }
}
