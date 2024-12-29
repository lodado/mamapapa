import React from 'react'

import { Dialog, DialogProps } from './components/compound'

export interface DialogTemplateProps extends DialogProps {
  Trigger?: () => JSX.Element
}

export const DialogTemplate = ({ Trigger, children, isVisible, onChangeVisible }: DialogTemplateProps) => {
  return (
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
  )
}
DialogTemplate.displayName = 'Dialog'
