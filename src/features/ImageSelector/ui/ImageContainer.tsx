"use client";

import React, { useEffect } from "react";

import { useImageSelectorStore } from "../models";
import { loadImagesFromIndexedDB } from "../utils/indexedDb";
import EmptyImageContainer from "./EmptyImageContainer";
import ImageLists from "./ImageLists";

const ImageContainer = () => {
  const { images, hydrateImages } = useImageSelectorStore();

  useEffect(() => {
    if (images.length > 0) return;

    let isMounted = true;

    const restoreImages = async () => {
      try {
        const storedImages = await loadImagesFromIndexedDB();

        if (!isMounted || storedImages.length === 0) return;

        hydrateImages(storedImages);
      } catch (error) {
        console.error(error);
      }
    };

    restoreImages();

    return () => {
      isMounted = false;
    };
  }, [hydrateImages, images.length]);

  return (
    <div className="p-4 flex grow flex-col justify-center items-center">
      <div className="w-full flex flex-col items-center ">
        {images.length === 0 ? <EmptyImageContainer key="empty-Image-container" /> : <ImageLists key="image-list" />}
      </div>
    </div>
  );
};

export default ImageContainer;
