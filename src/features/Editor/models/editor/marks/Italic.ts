import { toggleMark } from 'prosemirror-commands'
import { InputRule } from 'prosemirror-inputrules'
import { DOMOutputSpec } from 'prosemirror-model'

import BaseMark from './BaseMark'

export default class Italic extends BaseMark {
  get name(): string {
    return "italic";
  }

  get createSchema() {
    return {
      parseDOM: [
        { tag: "i" },
        { tag: "em", getAttrs: (node: HTMLElement) => node.style.fontStyle !== "normal" && null },
      ],
      toDOM() {
        return ["em", 0] satisfies DOMOutputSpec;
      },
    };
  }

  /** Bold와 혼용되지 않게 조심 */
  inputRules(): InputRule[] {
    return [
      new InputRule(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/, (state, match, start, end) => {
        return this.updateMark(state, match, start, end);
      }),
    ];
  }

  keys() {
    return {
      "Mod-i": this.toggleMarkDecorator(),
      "Mod-I": this.toggleMarkDecorator(),
    };
  }

  toMarkdown() {
    return {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }
}
