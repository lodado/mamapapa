import { toggleMark } from "prosemirror-commands";
import { InputRule } from "prosemirror-inputrules";
import { DOMOutputSpec, Mark } from "prosemirror-model";

import BaseMark from "./BaseMark";
import { sanitizeUrl } from "../utils";
import { EditorState, Plugin, Transaction } from "prosemirror-state";

const LINK_INPUT_REGEX = /\[([^[]+)]\((\S+)\)$/;

export default class Link extends BaseMark {
  get name(): string {
    return "link";
  }

  get defaultOptions() {
    return {
      href: "",
      title: "",
    };
  }

  get createSchema() {
    return {
      attrs: {
        href: {
          default: this.defaultOptions.href,
        },
        title: {
          default: this.defaultOptions.title,
        },
      },

      parseDOM: [
        {
          tag: "a[href]",
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
          }),
        },
      ],
      toDOM: (node: Mark) =>
        [
          "a",
          {
            title: node.attrs.title,
            href: sanitizeUrl(node.attrs.href),
            class: "",
            rel: "noopener noreferrer nofollow",
          },
          0,
        ] as DOMOutputSpec, // Add the type assertion to DOMOutputSpec
    };
  }

  inputRules(): InputRule[] {
    return [
      new InputRule(LINK_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, href] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, this.schema.text(alt)).addMark(
            start,
            start + alt.length,
            this.type.create({ href })
          );
        }

        return tr;
      }),
    ];
  }

  keys() {
    return {
      "Mod-k": (state: EditorState, dispatch: (tr: Transaction) => void) => {
        if (state.selection.empty) {
          return true;
        }

        return this.toggleMarkDecorator()(state, dispatch);
      },
    };
  } 

  toMarkdown() {
    throw new Error("Method not implemented.");
  }

  plugins() {
    return [
      ...super.plugins(),

      new Plugin({
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const { target } = event;

              /**TO DO - readMode - editorMode 분리 */
              if (target instanceof HTMLElement && target.tagName === "A") {
                event.preventDefault();
                window.open(target.getAttribute("href")!, "_blank");
              }

              return false;
            },
          },
        },
      }),
    ];
  }
}

