import React from "react";

import { DefaultLoadingPage } from "@/entities/index.server";

const Loading = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <DefaultLoadingPage />
    </>
  );
};

export default Loading;
