import React from 'react'

import { Dialog, DialogProps } from './components/compound'
import { cn } from "@/shared";
import { AnimatePresence } from "motion/react";
import { Motion } from "../animation/animation";

export interface DialogTemplateProps extends DialogProps {
  Trigger?: () => JSX.Element
}

export const DialogTemplate = ({ Trigger, children, isVisible, onChangeVisible }: DialogTemplateProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <Dialog isVisible={isVisible} onChangeVisible={onChangeVisible}>
          <Dialog.Root>
            {Trigger && (
              <Dialog.Trigger>
                <Trigger />
              </Dialog.Trigger>
            )}

            <Dialog.Content>{children}</Dialog.Content>
          </Dialog.Root>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
DialogTemplate.displayName = 'Dialog'
