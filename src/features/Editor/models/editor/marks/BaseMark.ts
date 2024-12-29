import { InputRule, inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { MarkSpec, MarkType, Node as ProsemirrorNode, NodeType, Schema } from 'prosemirror-model'
import { Command, EditorState, Plugin, Transaction } from "prosemirror-state";

import { getMarksAtRange, uniqueMarks } from "./utils";
import { MarkdownSerializerState } from "prosemirror-markdown";
import { toggleMark } from "prosemirror-commands";
import { EditorReduxStore } from "../../store";
import { FORCE_RERENDER_EDITOR_MARK_TOOLTIP } from "@/features/Editor/ui/components/MarkTooltip/model";

export default abstract class BaseMark {
  schema!: Schema;
  type!: MarkType;
  store!: typeof EditorReduxStore;

  setStore(store: typeof EditorReduxStore) {
    this.store = store;
  }

  abstract get name(): string;

  get createSchema(): MarkSpec {
    return {};
  }

  get defaultOptions() {
    return {};
  }

  setMetadata({ type, schema }: { type: MarkType; schema: Schema<any, any> }) {
    this.schema = schema;
    this.type = type;
  }

  plugins(): Plugin[] {
    const inputRulesPlugin = inputRules({ rules: this.inputRules() });

    return [keymap(this.keys()), inputRulesPlugin];
  }

  inputRules(): InputRule[] {
    return [];
  }

  keys(): Record<string, Command> | Record<string, (...any: any) => boolean> {
    return {};
  }

  commands() {
    return (attrs: any) => {};
  }

  /*
  toMarkdown(): { open: string; close: string; mixable?: boolean; expelEnclosingWhitespace?: boolean } {
    throw new Error("toMarkdown method is not implemented");
  }

  markdownSerializer(): { open: string; close: string; mixable: boolean; expelEnclosingWhitespace: boolean } {
    return { mixable: true, expelEnclosingWhitespace: true, ...this.toMarkdown() };
  }
  */

  parseMarkdown() {
    return {
      [this.name]: { mark: this.name },
    };
  }

  toggleMarkDecorator = () => (state: EditorState, dispatch: (tr: Transaction) => void) => {
    const command = toggleMark(this.type, this.defaultOptions, {
      removeWhenPresent: false,
    });

    if (command(state, dispatch)) {
      this.store.dispatch(FORCE_RERENDER_EDITOR_MARK_TOOLTIP());
      return true;
    }

    return false;
  };

  /**
   * Merges marks within the specified range in the editor state.
   *
   * @param state - The editor state.
   * @param match - The regular expression match array.
   * @param start - The start position of the range.
   * @param end - The end position of the range.
   * @returns The updated editor transaction.
   */
  updateMark = (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
    const { tr } = state;

    const marks = getMarksAtRange(state, start, end);

    if (match[1]) {
      tr.replaceWith(Math.max(start, 1), end, this.schema.text(match[1], uniqueMarks([this.type.create(), ...marks])));
      this.store.dispatch(FORCE_RERENDER_EDITOR_MARK_TOOLTIP());
    }

    return tr;
  };
}
