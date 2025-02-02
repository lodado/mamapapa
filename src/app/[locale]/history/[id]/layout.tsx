"use client";

import { useLoadingStore } from "@/shared/ui/LoadingSpinner";

import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

const layout = ({ children }: PropsWithChildren) => {
  const { setLoading } = useLoadingStore();

  useLayoutEffect(() => {
    setLoading(false);
  }, []);

  return <>{children}</>;
};

export default layout;
