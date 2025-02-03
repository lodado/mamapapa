"use client";

import React from "react";

import { useImageSelectorStore } from "../models";
import EmptyImageContainer from "./EmptyImageContainer";
import ImageLists from "./ImageLists";

const ImageContainer = () => {
  const { images } = useImageSelectorStore();

  return (
    <div className="p-4 flex grow flex-col justify-center items-center">
      <div className="w-full flex flex-col items-center ">
        {images.length === 0 ? <EmptyImageContainer key="empty-Image-container" /> : <ImageLists key="image-list" />}
      </div>
    </div>
  );
};

export default ImageContainer;
