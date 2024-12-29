import { toggleMark } from 'prosemirror-commands'
import { InputRule } from 'prosemirror-inputrules'
import { DOMOutputSpec, Mark, Node } from "prosemirror-model";

import BaseMark from './BaseMark'

export default class Bold extends BaseMark {
  get tag() {
    return "strong";
  }

  get name() {
    return "bold";
  }

  get createSchema() {
    return {
      parseDOM: [
        { tag: "strong" },
        { tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight !== "normal" && null },
      ],
      toDOM() {
        return ["strong", 0] satisfies DOMOutputSpec;
      },
    };
  }

  inputRules() {
    return [
      new InputRule(/(?:\*\*)([^*]+)(?:\*\*)$/, (state, match, start, end) => {
        return this.updateMark(state, match, start, end);
      }),
    ];
  }

  keys() {
    return {
      "Mod-b": this.toggleMarkDecorator(),
      "Mod-B": this.toggleMarkDecorator(),
    };
  }

  toMarkdown() {
    return {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return {
      [this.tag]: { mark: this.name },
    };
  }
}
