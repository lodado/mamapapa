/* eslint-disable no-param-reassign */
import { keymap } from 'prosemirror-keymap'
import { MarkSpec, MarkType, Schema } from 'prosemirror-model'
import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state'

import { SPACE } from '../../../constants'
import Bold from './Bold'
import Highlight from './Highlight'
import InlineCodeSnippet from './InlineCodeSnippet'
import Italic from './Italic'
import Strike from './Strike'
import Underline from './Underline'
import { isCursorInMark } from './utils'
 
import BaseMark from "./BaseMark";
import Link from "./Link";
import { EditorReduxStore } from "../../store";

const MARK_REGISTER = {
  Bold: new Bold(),
  Highlight: new Highlight(),
  InlineCodeSnippet: new InlineCodeSnippet(),
  Italic: new Italic(),
  Strike: new Strike(),
  Underline: new Underline(),
  Link: new Link(),
};

export class _MarkController {
  marks = MARK_REGISTER;
  store: typeof EditorReduxStore;

  constructor(store: typeof EditorReduxStore) {
    this.store = store;

    Object.entries(this.marks).forEach(([key, element]) => {
      element.setStore(store);
    });
  }

  private moveCursorOutOfMark = (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    if (!dispatch) return false;

    const { schema, selection } = state;
    const { from, $from } = selection;

    const isInmark = isCursorInMark(state);

    if (isInmark) {
      const blockEnd = $from.end();
      if (from === blockEnd) {
        const tempChar = SPACE;
        let tr = state.tr.insert(blockEnd, schema.text(tempChar));

        // Ensure the new position is within the document bounds
        const newPos = blockEnd + 1;
        tr = tr.setSelection(TextSelection.create(tr.doc, newPos));
        dispatch(tr);
      }
    }

    return false;
  };

  private globalMarkKeymaps = () => {
    return keymap({
      ArrowRight: (state: EditorState, dispatch?: (tr: Transaction) => void) =>
        this.moveCursorOutOfMark(state, dispatch),
    });
  };

  getPlugins(schema: Schema) {
    const plugins = Object.values(this.marks).flatMap((mark) => {
      const type = schema.marks[mark.name];

      mark.setMetadata({ type, schema });
      return mark.plugins();
    });

    plugins.push(this.globalMarkKeymaps());

    return plugins;
  }

  getMarks() {
    return Object.values(this.marks).reduce((obj: { [key in string]: MarkSpec }, mark) => {
      obj[mark.name] = mark.createSchema;
      return obj;
    }, {});
  }

  /*
  getMarkdownSerializer() {
    return {
      ...Object.values(this.marks).reduce(
        (
          obj: Record<string, { open: string; close: string; mixable: boolean; expelEnclosingWhitespace: boolean }>,
          mark: BaseMark
        ) => {
          obj[mark.name] = mark.markdownSerializer();

          return obj;
        },
        {}
      ),
    };
  }
  */

  getMarkdownParser() {
    return {
      ...Object.values(this.marks).reduce((obj: Record<string, { mark: string }>, mark: BaseMark) => {
        const [[key, value], _] = Object.entries(mark.parseMarkdown());

        obj[key] = value;

        return obj;
      }, {}),
    };
  }
}
 
