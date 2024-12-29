"use client";

import "../index.scss";
import { X } from "lucide-react";

import React, { CSSProperties, FormEvent, ReactNode, SyntheticEvent, useEffect, useState } from "react";

import { Close, Content, Overlay, Portal, Root, Trigger } from "./radix";
import { contextBuildHelper, noop } from "@/shared";

const [DialogProvider, useDialogContext] = contextBuildHelper<{
  isDialogVisible: boolean;
  onChangeVisibleStatus: (newVisibleStatus: boolean) => void;
}>({ id: "dialog" });

const DialogClose = ({ className }: { className: string }) => {
  return (
    <Close asChild>
      <button className={`IconButton ${className}`} type="button" aria-label="Close">
        <X />
      </button>
    </Close>
  );
};

const DialogRoot = ({ children }: { children: ReactNode }) => {
  const { isDialogVisible, onChangeVisibleStatus } = useDialogContext();

  return (
    <Root open={isDialogVisible} onOpenChange={onChangeVisibleStatus}>
      {children}
    </Root>
  );
};

const DialogTrigger = ({ children }: { children: ReactNode }) => {
  return <Trigger>{children}</Trigger>;
};

const DialogContent = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  return (
    <Portal>
      <Overlay className="fixed inset-0" />
      <Content
        style={style}
        className="fixed -translate-x-1/2 -translate-y-1/2 dialog-content z-dialog top-2/4 left-2/4"
      >
        {children}
      </Content>
    </Portal>
  );
};

/**
 * Properties for the SubmitForm component.
 *
 * This interface defines the props needed to handle form submission, including the children to be rendered within the form,
 * a submission handler, optional custom styling, and an error handler.
 */
export interface SubmitFormProps {
  /**
   * The children nodes to be rendered within the form. This can include any form elements such as inputs, labels,
   * and buttons, or other React nodes that form the content of the submission form.
   */
  children: ReactNode;

  /**
   * The event handler function that is called when the form is submitted.
   *
   * This function should be an asynchronous operation (returning a Promise) that handles the form submission logic,
   * such as validating the form data and sending it to a server. The function receives the form event, allowing
   * for custom handling like preventing the default form submission behavior.
   *
   * @param event - The form event triggered upon form submission.
   */
  onSubmit: (event: SyntheticEvent) => Promise<void>;

  onClose?: () => void;

  /**
   * An optional CSS class name to apply to the form for styling purposes. This allows for custom styling of the
   * form element, making it possible to adapt the appearance of the form to match the rest of the application's design.
   */
  className?: string;

  /**
   * An optional error handler function that is called if an error occurs during form submission. This provides a way
   * to handle submission errors, such as displaying error messages to the user or logging the error for debugging purposes.
   *
   * @param error - The error object or message encountered during the submission process.
   */
  onError?: (error: unknown) => void;
}

const SubmitForm = ({ className, children, onSubmit, onClose = noop, onError = noop }: SubmitFormProps) => {
  const { isDialogVisible, onChangeVisibleStatus } = useDialogContext();

  useEffect(() => {
    return () => {
      if (!isDialogVisible) {
        onClose();
      }
    };
  }, [isDialogVisible]);

  return <div className={className}>{children}</div>;
};

/**
 * Properties for the Dialog component.
 */
export interface DialogProps {
  /**
   * The children nodes to be rendered within the dialog. This can be any valid
   * React Node (e.g., elements, strings, fragments, or an array of these types).
   */
  children: ReactNode;

  /**
   * A boolean indicating whether the dialog is currently visible.
   * If not provided, the dialog visibility will be managed internally or by parent components.
   * Defaults to `false` if not specified.
   */
  isVisible?: boolean;

  /**
   * An optional callback function that is called when the visibility of the dialog needs to change.
   * This allows parent components to control the visibility state of the dialog.
   *
   * @param newVisibleStatus - The new visibility state (true for visible, false for hidden) that should be applied to the dialog.
   */
  onChangeVisible?: (newVisibleStatus: boolean) => void;

  className?: string;
}

export const Dialog = ({ isVisible = undefined, onChangeVisible, children }: DialogProps) => {
  const [open, setOpen] = useState(false);

  const isDialogVisible = isVisible ?? open;
  const handleChangeVisibleStatus = (newVisibleStatus: boolean) => {
    if (onChangeVisible) {
      onChangeVisible(newVisibleStatus);

      return;
    }

    setOpen(newVisibleStatus);
  };

  return (
    <DialogProvider isDialogVisible={isDialogVisible} onChangeVisibleStatus={handleChangeVisibleStatus}>
      {children}
    </DialogProvider>
  );
};

Dialog.displayName = "Dialog";

Dialog.Root = DialogRoot;
Dialog.Trigger = DialogTrigger;
Dialog.SubmitForm = SubmitForm;
Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

export { DialogProvider, useDialogContext };
