import { Plugin, PluginKey } from "prosemirror-state";
import React, { PropsWithChildren, useState } from "react";

import Widget from "../Widget";
import { EDITOR_LINK_DIALOG_OPEN } from "./model";
import EditorLinkDialog from "./ui";

export default class EditorLinkDialogWidget extends Widget {
  render() {
    return <EditorLinkDialog />;
  }

  plugin() {
    return [];
  }
}
