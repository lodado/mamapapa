import { InputRule, inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { MarkdownSerializerState } from "prosemirror-markdown";
import { Node as ProsemirrorNode, NodeSpec, NodeType, Schema } from "prosemirror-model";
import { Command, Plugin } from "prosemirror-state";

export default abstract class BaseNode {
  schema!: Schema;
  type!: NodeType;

  abstract get name(): string;

  defaultClassName() {
    return "editor-block";
  }

  get createSchema(): NodeSpec {
    return {};
  }

  get defaultOptions() {
    return {};
  }

  setMetadata({ type, schema }: { type: NodeType; schema: Schema<any, any> }) {
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

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
    throw new Error("toMarkdown method is not implemented");
  }

  parseMarkdown(): { block: string } {
    return { block: this.name };
  }

  markdownSerializer(): Record<string, (state: MarkdownSerializerState, node: ProsemirrorNode) => void> {
    return {
      [this.name]: this.toMarkdown,
    };
  }
}
