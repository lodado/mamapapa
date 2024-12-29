"use client";

import { DOMParser, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, { useEffect, useRef, useState } from "react";

import { createState, createView, ProseMirrorNode } from "../models/editor";
import { WidgetController } from "../ui/components";
import { EditorReduxStore } from "../models";
import useEditorData from "./useEditorData";
import { useEditorDispatch } from "./useEditorDispatcher";
import { RESET_EDITOR_STATUS } from "../models/store/saga";
import { _NodeController } from "../models/editor/nodes/NodeController";
import { _MarkController } from "../models/editor/marks/MarkController";

export const useEditorView = (ReduxLocalStore: typeof EditorReduxStore) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorDispatch = useEditorDispatch();

  const [isMounted, setIsMounted] = useState(false);

  const [view, setView] = useState<EditorView | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [widgetController, setWidgetController] = useState(() => new WidgetController(ReduxLocalStore));
  const [NodeController] = useState(() => {
    return new _NodeController(ReduxLocalStore);
  });

  const [MarkController] = useState(() => {
    return new _MarkController(ReduxLocalStore);
  });

  const { content } = useEditorData({ view: view });

  const initEditor = (
    domParser = (schema: Schema<any, any>) => DOMParser.fromSchema(schema).parse(editorRef.current!)
  ) => {
    setIsMounted(false);

    const newWidgetController = new WidgetController(ReduxLocalStore);

    const state = createState({
      widgetController: newWidgetController,
      getDoc: domParser,

      NodeController,
      MarkController,
    });

    const viewInstance = createView({
      editor: editorRef.current!,
      state,
    });

    setEditorState(state);
    setView(viewInstance);

    setIsMounted(true);
    setWidgetController(newWidgetController);
    editorDispatch(RESET_EDITOR_STATUS());

    return () => viewInstance.destroy();
  };

  /** anti patten이긴 한데 ㅠ
    content 상태 update시 자동으로 proseMirror에 상태 반영함 */
  useEffect(() => {
    const domParser =
      view && content ? (schema: Schema<any, any>) => ProseMirrorNode.fromJSON(schema, content.toJSON()) : undefined;

    const destroyView = initEditor(domParser);

    return destroyView;
  }, [content]);

  return { isMounted, editorRef, editorState, view, widgetController, NodeController, MarkController };
};
