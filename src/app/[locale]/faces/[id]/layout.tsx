import React, { ReactNode } from "react";

const layout = ({ children, modal }: { children: ReactNode; modal: ReactNode }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default layout;
