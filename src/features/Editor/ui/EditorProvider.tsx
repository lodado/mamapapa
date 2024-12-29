"use client";

import { contextBuildHelper } from "@/shared";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { _NodeController } from "../models/editor/nodes/NodeController";
import { _MarkController } from "../models/editor/marks/MarkController";

export const [EditorProvider, useEditorContext] = contextBuildHelper<{
  view: EditorView;
  editorState: EditorState;

  NodeController: _NodeController;
  MarkController: _MarkController;
}>({ id: "proseEdittor" });
