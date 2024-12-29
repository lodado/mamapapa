import { DOMParser, Node, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

import { createPlugin } from "./plugins/plugin";
import { createSchema } from "./schema/schema";
import { WidgetController } from "../../ui/components";
import { _MarkController } from "./marks/MarkController";
import { _NodeController } from "./nodes/NodeController";

export const createState = ({
  widgetController,
  getDoc,
  schema,
  NodeController,
  MarkController,
}: {
  widgetController: WidgetController;
  getDoc: (schemaObject: Schema) => Node;
  schema?: Schema;
  NodeController: _NodeController;
  MarkController: _MarkController;
}) => {
  const schemaData = schema ?? createSchema({ NodeController, MarkController });

  return EditorState.create({
    doc: getDoc(schemaData),
    plugins: createPlugin(schemaData, widgetController, NodeController, MarkController),
    schema: schemaData,
  });
};
