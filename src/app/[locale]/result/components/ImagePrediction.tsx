"use client";

import { useFaceModelStore } from "@/features/AiModel/model";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import React, { useLayoutEffect } from "react";
import { cosineSimilarity, cosineToPercentage } from "../utils/similarity";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { USER_PLAYER_NAME } from "@/entities";
import Image from "next/image";

import Simliarity0 from "/public/similarity0.svg";
import Simliarity20 from "/public/similarity20.svg";
import Simliarity50 from "/public/similarity50.svg";
import Simliarity80 from "/public/similarity80.svg";

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

  if (isLoading) return <div className="spinner"></div>;

  const playerImage = images.find((image) => image.selectedPlayer === USER_PLAYER_NAME)!;
  const comparisons = images
    .filter((image) => image.selectedPlayer)
    .filter((image) => image.id !== playerImage?.id && image.embedding)
    .map((image) => ({
      ...image,
      similarity: playerImage?.embedding
        ? cosineToPercentage(cosineSimilarity(playerImage!.embedding!, image.embedding!))
        : 0,
    }));

  return (
    <div className="w-full flex flex-col items-center p-4">
      {comparisons.map((comparison) => {
        const simliarity = comparison.similarity;

        return (
          <section
            key={comparison.id}
            className="headline text-text-01 w-full flex-col max-w-md p-4 rounded-lg flex items-center space-x-4"
          >
            <div className="w-full flex flex-col items-center mb-[0.625rem]">
              <p className="flex flex-row items-center gap-1">
                {simliarity < 20 && <Simliarity0 />}
                {simliarity >= 20 && simliarity < 50 && <Simliarity20 />}
                {simliarity >= 50 && simliarity < 70 && <Simliarity50 />}
                {simliarity >= 70 && <Simliarity80 />}[{playerImage.selectedPlayer}]와 [{comparison.selectedPlayer}]는{" "}
                <span
                  className={`underline
                  ${simliarity < 20 ? "text-text-03" : ""}
                  ${simliarity >= 20 && simliarity < 50 ? "text-text-error" : ""}
                  ${simliarity >= 50 && simliarity < 70 ? "text-text-02" : ""}
                  ${simliarity >= 70 ? "text-text-primary" : ""}
                  `}
                >
                  {comparison.similarity}%
                </span>
              </p>

              <p>닮았습니다.</p>
            </div>
            <div className="w-full flex flex-row gap-[0.4688rem]">
              <div className="relative w-[50%]">
                <div className="relative before:content-[''] before:block before:pb-[100%]">
                  <div className="text-text-00 subhead absolute top-2 left-2 z-10">{playerImage.selectedPlayer}</div>

                  <Image
                    src={playerImage.url}
                    alt={`${playerImage.selectedPlayer} image`}
                    className="absolute inset-0 object-cover rounded-lg"
                    fill
                    sizes="(max-width: 768px) 100vw, 24rem"
                  />
                </div>
              </div>
              <div className="relative w-[50%]">
                <div className="relative before:content-[''] before:block before:pb-[100%]">
                  <div className="text-text-00 subhead absolute top-2 left-2 z-10">{comparison.selectedPlayer}</div>

                  <Image
                    src={comparison.url}
                    alt={`${comparison.selectedPlayer} image`}
                    className="absolute inset-0 object-cover rounded-lg"
                    fill
                    sizes="(max-width: 768px) 100vw, 24rem"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ImagePrediction;
