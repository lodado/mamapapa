import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

import { Navigation } from "@/widgets/index.server";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation.Root>
        <Navigation.Header />
        <Navigation.Footer authRepository={new EDGE_DI_REPOSITORY.Auth()} />
      </Navigation.Root>
      {children}
    </>
  );
};

export default Layout;
