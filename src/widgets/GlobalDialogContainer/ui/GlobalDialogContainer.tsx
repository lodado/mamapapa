import { LoginDialog } from '@/features';
import { PageLoading } from "@/shared/ui";
import React from 'react';

const GlobalDialogContainer = () => {
  return (
    <>
      <PageLoading />
      <LoginDialog />
    </>
  );
};

export default GlobalDialogContainer;
