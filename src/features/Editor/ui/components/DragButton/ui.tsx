"use client";

import { Root } from "@radix-ui/react-portal";

import { Fragment, Node as ProseMirrorNode, Slice } from "prosemirror-model";
import { dropPoint } from "prosemirror-transform";
import React, { MouseEventHandler, SyntheticEvent } from "react";

import { findTopLevelNode } from "../../../models/editor/nodes/utils";
import { blockDnDHoverPluginDispatcher } from "../../../models/editor/plugins/highlightPlugin";
import { useEditorContext } from "../../EditorProvider";
import { useNodeDnDPlaceHolder } from "./hook";
import { DRAG_BUTTON_SET_DRAG_FLAG } from "./model";
 
import { useEditorDispatch, useEditorSelector } from "@/features/Editor/hooks";
import { GripVertical } from "lucide-react";

import { ICON_BUTTON_SIZE } from "@/features/Editor/constants";
import { isRTL } from "@/features/Editor/utils";
import { ScreenReaderOnly } from "@/shared/ui";

export const DragButton = () => {
  const { view, editorState } = useEditorContext();
  const isDocumentRTL = isRTL();
  const EDITOR_MARGIN = isDocumentRTL ? -50 : 50;

  const {
    placeholderPos,
    showPlaceholder,
    nodeContent,
    handleNodeContent,
    handlePlaceholderPos,
    handleShowPlaceholder,
  } = useNodeDnDPlaceHolder();

  const isOpen = useEditorSelector((state) => state.dragButton.isOpen);
  const targetPosition = useEditorSelector((state) => state.dragButton.targetPosition);
  const position = useEditorSelector((state) => state.dragButton.position);

  const { hoverDndPlaceholderDispatcher, resetHoverDndPlaceholderDispatcher } = blockDnDHoverPluginDispatcher(view);
  const editorDispatch = useEditorDispatch();

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (event: SyntheticEvent) => {
    event.preventDefault();
    editorDispatch(DRAG_BUTTON_SET_DRAG_FLAG(true));
    handleShowPlaceholder(true);

    let dragStartPos: { x: number; y: number } | null = null;
    let animationFrameId: number;

    const initPos = view.posAtCoords({
      left: (event as unknown as MouseEvent).clientX + EDITOR_MARGIN,
      top: (event as unknown as MouseEvent).clientY,
    });

    if (initPos) {
      const resolvedPos = view.state.doc.resolve(initPos.pos);
      const node = resolvedPos.node(resolvedPos.depth);
      handleNodeContent(node);
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStartPos) {
        dragStartPos = { x: e.clientX, y: e.clientY };
      }

      const pos = view.posAtCoords({ left: e.clientX + EDITOR_MARGIN, top: e.clientY });
      if (!pos) return;

      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;

      const point = dropPoint(
        view.state.doc,
        pos.pos,
        new Slice(Fragment.from(view.state.schema.nodes.paragraph.createAndFill()), 0, 0)
      );

      if (point !== null) {
        const resolvedPos = view.state.doc.resolve(pos.pos);
        const node = resolvedPos.node(resolvedPos.depth);

        const start = resolvedPos.start(resolvedPos.depth) - 1;
        const end = resolvedPos.end(resolvedPos.depth) + 1;

        hoverDndPlaceholderDispatcher({ node, start, end, point });
      }

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        (event.target as HTMLButtonElement).style.transform = `translate(0px, ${dy}px)`;
        (event.target as HTMLButtonElement).style.opacity = `0`;
        (event.target as HTMLButtonElement).style.cursor = `grabbing`;
        document.body.style.cursor = "grabbing";

        handlePlaceholderPos({ x: e.clientX + EDITOR_MARGIN, y: e.clientY });
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      try {
        if (!targetPosition) return;

        // eslint-disable-next-line prefer-const
        let { node: targetNode, pos: targetPos } = findTopLevelNode(view.state.doc, targetPosition!);

        const pos = view.posAtCoords({ left: e.clientX + EDITOR_MARGIN, top: e.clientY });
        const node = pos && pos.inside >= 0 && view.state.doc.nodeAt(pos.inside);
        let offset = 0;

        if (!targetNode) {
          targetNode = view.state.schema.nodes.paragraph.createAndFill()!;
          offset += 1;
        }

        if (pos && node) {
          // 트랜잭션을 실행하여 노드 이동
          const { tr } = view.state;

          // Delete the original node before inserting the new one
          if (targetNode.nodeSize > 0) {
            tr.delete(targetPos, targetPos + targetNode!.nodeSize);
            offset = targetNode!.nodeSize + 1;
          }

          const point = dropPoint(
            view.state.doc,
            view.posAtCoords({ left: e.clientX + EDITOR_MARGIN, top: e.clientY })!.pos,
            new Slice(Fragment.from(targetNode), 0, 0)
          );

          if (point !== null) {
            if (point <= targetPos) {
              offset = 0;
            }

            tr.insert(Math.max(point - offset, 0), Fragment.from(targetNode));
          }

          view.dispatch(tr);
        }
      } catch (error) {
        console.error(error);
      } finally {
        resetHoverDndPlaceholderDispatcher();

        handleNodeContent(null);
        handleShowPlaceholder(false);

        editorDispatch(DRAG_BUTTON_SET_DRAG_FLAG(false));

        (event.target as HTMLButtonElement).style.transform = "";
        (event.target as HTMLButtonElement).style.opacity = `1`;
        (event.target as HTMLButtonElement).style.cursor = `pointer`;

        document.body.style.cursor = "default";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (!isOpen) return null;

  return (
    <Root>
      <button
        type="button"
        className="bg-transparent  text-cancel-default"
        style={{
          position: "absolute",
          inlineSize: `22px`, // width -> inline-size
          blockSize: `${ICON_BUTTON_SIZE}px`, // height -> block-size
          insetBlockStart: position.y,
          insetInlineStart: position.x,
          cursor: "pointer",
        }}
        onMouseDown={handleMouseDown}
      >
        <div role="none presentation" aria-hidden={false} />
        <GripVertical className="text-color-background-accent-gray-subtlest-pressed" size={22} />
        <ScreenReaderOnly>Drag button</ScreenReaderOnly>
      </button>

      {showPlaceholder && (
        <div
          className="drag-placeholder"
          style={{
            direction: "ltr",
            position: "absolute",
            insetBlockStart: placeholderPos.y, // top -> inset-block-start
            insetInlineStart: placeholderPos.x,
            color: "var(--Color-Text-Default)",
            pointerEvents: "none",
            opacity: 0.3,
            zIndex: 9999,
          }}
        >
          {nodeContent}
        </div>
      )}
    </Root>
  );
};
