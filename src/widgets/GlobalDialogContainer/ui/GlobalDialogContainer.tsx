import { LoginFormDialog } from "@/entities/Auth";
import { LoadingSpinner } from "@/shared/ui/LoadingSpinner";
import React from "react";

const GlobalDialogContainer = () => {
  return (
    <>
      <LoginFormDialog />
      <LoadingSpinner />
    </>
  );
};

export default GlobalDialogContainer;
