"use client";

import { useTranslations } from "next-intl";
import React, { useLayoutEffect } from "react";

import { USER_PLAYER_NAME_INTI_KEY } from "@/entities";
import { useFaceModelStore } from "@/features/AiModel/model";
import { ComparisonMetaData, useImageSelectorStore } from "@/features/ImageSelector/models";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { ImagePrediction } from "@/widgets/ImagePrediction";
import { cosineSimilarity, cosineToPercentage } from "@/widgets/ImagePrediction/utils/similarity";

const ResultPageImagePrediction = () => {
  const t = useTranslations();

  const { faceRecognitionModel } = useFaceModelStore();
  const { images, generateEmbeddings } = useImageSelectorStore();
  const { isLoading, setLoading } = useLoadingStore();

  const handleGenerateEmbeddings = async () => {
    setLoading(true);
    await generateEmbeddings(faceRecognitionModel!);
    setLoading(false);
  };

  useLayoutEffect(() => {
    if (faceRecognitionModel) handleGenerateEmbeddings();
  }, [!faceRecognitionModel, images.map((element) => element.selectedPlayer ?? "-").join("/")]);

  if (isLoading || !faceRecognitionModel) return <div className="spinner"></div>;

  const playerImage = images.find((image) => image.selectedPlayer === t(USER_PLAYER_NAME_INTI_KEY))!;
  const comparisons = images
    .filter((image) => image.selectedPlayer)
    .filter((image) => image.id !== playerImage?.id && image.embedding)
    .map((image) => ({
      ...image,
      similarity: playerImage?.embedding
        ? cosineToPercentage(cosineSimilarity(playerImage!.embedding!, image.embedding!))
        : 0,
    }));

  return <ImagePrediction playerImage={playerImage as ComparisonMetaData} comparisons={comparisons} />;
};

export default ResultPageImagePrediction;
