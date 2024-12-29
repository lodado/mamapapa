import { Slot } from "@radix-ui/react-slot";
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
      className={cn("flex flex-col w-full px-4 gap-1 pb-2", className)}
      onClose={onClose}
      onSubmit={onSubmit}
      onError={onError}
    >
      {children}

      <Button className="w-full mb-2" type="submit" size="medium" variant="primary" onClick={handleDialogSubmit}>
        {submitText}
      </Button>
      <Button
        className="w-full"
        onClick={() => onChangeVisibleStatus(false)}
        type="button"
        size="medium"
        variant="secondary"
      >
        {cancelText}
      </Button>
    </Dialog.SubmitForm>
  );
};

const DialogHeader = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <Title className={cn("flex flex-row justify-between w-full mb-3 heading-02 pt-6 px-4", className)}>
      {children}
    </Title>
  );
};

const DialogBody = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={cn("flex w-full py-4 grow body-01 px-4 pb-8", className)}>{children}</div>;
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
    <DialogTemplate isVisible={isVisible} onChangeVisible={onChangeVisible} Trigger={Trigger}>
      <div
        className={cn(
          `text-text-default flex-col border-solid rounded-lg bg-background border-1 border-color-border-brand w-80 shadow-dropdown`,
          className
        )}
      >
        {children}
      </div>
    </DialogTemplate>
  );
};

AlertDialog.Header = DialogHeader;
AlertDialog.Body = DialogBody;
AlertDialog.SubmitForm = SubmitForm;
AlertDialog.Close = Dialog.Close;
AlertDialog.Description = AlertDescription;

AlertDialog.displayName = "dialog";
