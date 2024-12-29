import { Plugin, PluginKey } from "prosemirror-state";
import React from "react";

import Widget from "../Widget";
import { DISAPPEAR_BLOCK_CREATE_BUTTON, SHOW_BLOCK_CREATE_BUTTON } from "./model";
import { BlockCreateButton } from "./ui";
import { getActualCoord } from "@/features/Editor/utils";
 
export default class BlockCreateButtonWidget extends Widget {
  render() {
    return <BlockCreateButton />;
  }

  plugin() {
    return [
      new Plugin({
        key: new PluginKey("blockCreateButton"),
        props: {
          handleDOMEvents: {
            mouseover: (view, event) => {
              const { target } = event;

              // @ts-ignore
              const pos = view.posAtDOM(target, 0);
              const { doc, schema } = view.state;
              const $pos = doc.resolve(pos);
              const node = $pos.parent;

              const actualCoords = getActualCoord({ view, pos });

              if (node && node.type.name !== "doc") {
                this.store.dispatch(SHOW_BLOCK_CREATE_BUTTON({ x: 0, y: actualCoords.bottom - 20 }));
              } else {
                // this.store.dispatch(DISAPPEAR_BLOCK_CREATE_BUTTON());
              }

              return false;
            },
          },
        },
      }),
    ];
  }
}
