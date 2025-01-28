"use client";

import { useFaceModelStore } from "@/features/AiModel/model";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import React, { useLayoutEffect } from "react";
import { cosineSimilarity } from "../utils/similarity";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";

const USER_PLAYER_NAME = "나";

const ImagePrediction = () => {
  const { faceRecognitionModel } = useFaceModelStore();
  const { images, generateEmbeddings } = useImageSelectorStore();
  const { isLoading, setLoading } = useLoadingStore();

  const handleGenerateEmbeddings = async () => {
    setLoading(true);
    await generateEmbeddings(faceRecognitionModel!);
    setLoading(false);
  };

  useLayoutEffect(() => {
    handleGenerateEmbeddings();
  }, [images.map((element) => element.selectedPlayer ?? "-").join("/")]);

  if (isLoading) return <></>;

  const playerImage = images.find((image) => image.selectedPlayer === USER_PLAYER_NAME);
  const comparisons = images
    .filter((image) => image.id !== playerImage?.id && image.embedding)
    .map((image) => ({
      ...image,
      similarity: playerImage?.embedding ? cosineSimilarity(playerImage!.embedding!, image.embedding!) : 0,
    }));

  return (
    <div>
      {comparisons.map((comparison) => {
        return (
          <div key={comparison.id}>
            <img src={comparison.url} alt={`${comparison.selectedPlayer} image`} />
            <p> {comparison.selectedPlayer} </p>
            <p>{comparison.similarity}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ImagePrediction;
