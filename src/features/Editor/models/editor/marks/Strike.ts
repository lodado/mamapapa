import { InputRule } from 'prosemirror-inputrules'
import { DOMOutputSpec, Mark, MarkSpec } from 'prosemirror-model'

import BaseMark from './BaseMark'

class Strike extends BaseMark {
  get name() {
    return "strike";
  }

  get createSchema(): MarkSpec {
    return {
      parseDOM: [{ tag: "s" }, { tag: "del" }, { style: "text-decoration=line-through" }],
      toDOM: () => ["s", 0] satisfies DOMOutputSpec,
    };
  }

  inputRules(): InputRule[] {
    return [
      new InputRule(/~([^~]+)~$/, (state, match, start, end) => {
        return this.updateMark(state, match, start, end);
      }),
    ];
  }

  keys() {
    return {
      "Mod-d": this.toggleMarkDecorator(),
    };
  }

  toMarkdown() {
    return {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }
}

export default Strike
