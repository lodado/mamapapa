"use client";

import React from "react";

import DragButtonWidget from "./DragButton/widget";
import BlockCreateButtonWidget from "./BlockCreateButton/widget";
import { EditorReduxStore } from "../../models";
import EditorMarkTooltipWidget from "./MarkTooltip/widget";
import EditorLinkDialogWidget from "./LinkDialog/widget";

export default class WidgetController {
  widgets = [
    new DragButtonWidget(),
    new EditorLinkDialogWidget(),
    new BlockCreateButtonWidget(),
    new EditorMarkTooltipWidget(),
  ];

  constructor(store: typeof EditorReduxStore) {
    this.widgets.forEach((widget) => {
      widget.setStore(store);
    });
  }

  getPlugins() {
    return this.widgets.flatMap((widget) => widget.plugin());
  }

  Widgets = () => {
    return (
      <>
        {this.widgets.map((widget) => {
          return <widget.render key={widget.key} />;
        })}
      </>
    );
  };
}
