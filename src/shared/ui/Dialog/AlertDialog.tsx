import React, { PropsWithChildren, ReactNode, SyntheticEvent, use, useEffect } from "react";

import { Button } from "../Button";

import { Dialog, SubmitFormProps, useDialogContext } from "./components/compound";
import { Description, Title } from "./components/radix";
import { DialogTemplate, DialogTemplateProps } from "./DialogTemplate";
import { cn } from "@/shared";

interface DialogSubmitFormProps extends Omit<SubmitFormProps, "children"> {
  children?: ReactNode;
  submitText: string;
  cancelText: string;
}

const SubmitForm = ({
  children,
  className,
  submitText,
  cancelText,
  onSubmit,
  onClose,
  onError,
}: DialogSubmitFormProps) => {
  const { onChangeVisibleStatus } = useDialogContext();

  const handleDialogSubmit = async (event: SyntheticEvent) => {
    try {
      await onSubmit(event);
    } catch (error) {
      onError?.(error);
    } finally {
      onChangeVisibleStatus(false);
    }
  };

  return (
    <Dialog.SubmitForm
      className={cn("flex flex-row w-full  justify-center px-6 py-4 gap-2", className)}
      onClose={onClose}
      onSubmit={onSubmit}
      onError={onError}
    >
      {children}
      <Button
        className="rounded-[12px] grow h-full"
        onClick={() => onChangeVisibleStatus(false)}
        type="button"
        variant="line"
      >
        {cancelText}
      </Button>
      <Button className="rounded-[12px] grow h-full" type="button" variant="primarySolid" onClick={handleDialogSubmit}>
        {submitText}
      </Button>
    </Dialog.SubmitForm>
  );
};

const DialogHeader = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <Title className={cn("headline flex flex-col w-full pt-2 items-center gap-2")}>
      <div role="none presentation" className="w-[3rem] h-1 rounded-[100px] bg-border-borderOpaque  " />

      <div
        className={cn(
          "w-full py-[0.625rem] px-[1rem] text-text-01 flex flex-row justify-center items-center",
          className
        )}
      >
        {children}
      </div>
    </Title>
  );
};

const DialogBody = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={cn("flex w-full pt-4 grow body-01 px-6", className)}>{children}</div>;
};

/**
 * Properties for the AlertDialog component.
 *
 * This interface extends `DialogTemplateProps` and `SubmitFormProps` by inheriting all their properties
 * except for `children`, which is explicitly redefined here. It's designed to create alert dialogs
 * that can optionally submit data, displaying a consistent interface while allowing for customization
 * and functionality extension.
 */
export interface AlertDialogProps extends Omit<DialogTemplateProps, "children"> {
  /**
   * The children nodes to be rendered within the body of the alert dialog. This can include messages,
   * forms, or any other React nodes appropriate for the dialog's content.
   */
  children: ReactNode;
}

export const AlertDescription = ({ className, children }: PropsWithChildren & { className?: string }) => {
  return <Description className={`${className}`}>{children}</Description>;
};

export const AlertDialog = ({ Trigger, isVisible, onChangeVisible, children, className }: AlertDialogProps) => {
  return (
    <DialogTemplate className={className} isVisible={isVisible} onChangeVisible={onChangeVisible} Trigger={Trigger}>
      {children}
    </DialogTemplate>
  );
};

AlertDialog.Header = DialogHeader;
AlertDialog.Body = DialogBody;
AlertDialog.SubmitForm = SubmitForm;
AlertDialog.Close = Dialog.Close;
AlertDialog.Description = AlertDescription;

AlertDialog.displayName = "dialog";
