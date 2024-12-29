import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";

import { _NodeController } from "../nodes/NodeController";
import { _MarkController } from "../marks/MarkController";

const { nodes: basicNodes, marks: basicMarks } = basicSchema.spec;

export const createSchema: ({
  NodeController,
  MarkController,
}: {
  NodeController: _NodeController;
  MarkController: _MarkController;
}) => Schema = ({ NodeController, MarkController }) => {
  const customNodes = NodeController.getNodes();
  const customMarks = MarkController.getMarks();

  let nodes = basicNodes.remove("hard_break");
  let marks = basicMarks.remove("em").remove("strong");

  Object.keys(customNodes).forEach((key) => {
    nodes = nodes.remove(key);
    nodes = nodes.addToStart(key, customNodes[key]);
  });

  Object.keys(customMarks).forEach((key) => {
    marks = marks.remove(key);
    marks = marks.addToEnd(key, customMarks[key]);
  });

  return new Schema({
    nodes,
    marks,
  });
};
