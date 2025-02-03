"use client";

import { useImageSelectorStore } from "@/features/ImageSelector/models";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";

import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

const layout = ({ children }: PropsWithChildren) => {
  const { setLoading } = useLoadingStore();
  const { clearImages } = useImageSelectorStore();

  

  useLayoutEffect(() => {
    setLoading(false);
    clearImages();
  }, []);

  return <>{children}</>;
};

export default layout;
