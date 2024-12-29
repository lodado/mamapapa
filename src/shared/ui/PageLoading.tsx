"use client";

import { useDispatch, useInterval, useSelector } from "@/shared/hooks";
import { Root } from "@radix-ui/react-dialog";
import React, { use, useEffect, useState } from "react";

const PageLoading = () => {
  const isLoading = useSelector((state) => state.pageLoading.isLoading);
  const [textComma, setTextComma] = useState(1);

  useInterval(() => {
    if (isLoading) setTextComma((prev) => (prev + 1) % 4);
  }, 300);

  if (!isLoading) return null;

  return (
    <Root>
      <div
        style={{ backgroundColor: "rgba(0 0, 0, 0.8)" }}
        className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-loading"
      >
        <div className="text-background">Loading{Array(textComma).fill(".").join("")}</div>
      </div>
    </Root>
  );
};

export default PageLoading;
