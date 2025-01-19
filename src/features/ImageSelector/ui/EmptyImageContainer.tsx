"use client";

import React from "react";
import ImageContainerSvg from "./ImageContainer.svg";

const EmptyImageContainer = () => {
  return (
    <>
      <ImageContainerSvg />

      <span className="text-text-01 headline m-2">비교할 사진을 추가해주세요.</span>

      <>
        <span className="text-text-03 text-center w-full body-2">비교할 사진을 추가하고</span>

        <span className="text-text-03 text-center w-full body-2"> 사진을 분류해주세요.</span>
      </>
    </>
  );
};

export default EmptyImageContainer;
