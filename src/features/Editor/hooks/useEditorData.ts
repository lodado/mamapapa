import { CLIENT_DI_REPOSITORY } from "@/DI/index";
import { UpdateEditorNodeUseCase } from "./../models/core/usecase/UpdateEditorNodeUsecase";
import { useEditorDispatch, useEditorSelector } from "./useEditorDispatcher";
import { EditorView } from "prosemirror-view";
import { EditorNode, EditorRepositoryImpl, SET_EDITOR_CONTENT } from "../models";
import { EditorIndexedDBRepository } from "../models/client/repository/EditorIndexedDBRepository";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GetEditorNodeUseCase } from "../models/core/usecase/GetEditorNodeUseCase";
import { useSelector } from "@/shared/hooks";
 

/**
 * // TODO
 * tanstack query로 migration
 */
const useEditorData = ({ view }: { view?: EditorView | null }) => {
  const userInfo = useSelector((state) => state.auth.user);

  const content = useEditorSelector((state) => state.editorContent.content);
  const editorIndexedDBRepository = useMemo(() => new EditorIndexedDBRepository(), []);
  const editorDispatch = useEditorDispatch();

  const handleSaveContent = useCallback(
    (editorRepository: EditorRepositoryImpl) => async () => {
      if (view) {
        const authClientRepository = new CLIENT_DI_REPOSITORY.Auth(userInfo);
        const savedData = new EditorNode({ content: view.state.doc.toJSON() });

        try {
          await new UpdateEditorNodeUseCase(editorRepository, authClientRepository).execute({
            content: savedData.content,
          });

          editorDispatch(SET_EDITOR_CONTENT(savedData));

          console.log("save ", savedData);
        } catch (error) {
          console.error("Failed to save editor content:", error);
        }
      }
    },
    [view]
  );

  const handleLoadContent = useCallback(
    (editorRepository: EditorRepositoryImpl) => async () => {
      if (view) {
        try {
          const authClientRepository = new CLIENT_DI_REPOSITORY.Auth(userInfo);

          const savedNode = await new GetEditorNodeUseCase(editorRepository, authClientRepository).execute();

          if (savedNode) {
            editorDispatch(SET_EDITOR_CONTENT(savedNode));
          }
        } catch (error) {
          console.error("Failed to load editor content:", error);
        }
      }
    },
    [view]
  );

  return { content, handleSaveContent, handleLoadContent, editorIndexedDBRepository };
};

export default useEditorData;
