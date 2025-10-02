import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { usePlayerStore } from "@/entities/Player";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { useFaceDetection } from "../../hooks/useFaceDetection";
import { CelebrityProfile } from "../configs/sampleCelebrities";

const fetchImageAsFile = async (imageUrl: string, filename: string) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch celebrity image");
  }

  const blob = await response.blob();
  const extension = blob.type.split("/").pop() ?? "jpg";

  return new File([blob], `${filename}.${extension}`, { type: blob.type });
};

const createImageMetadata = (file: File, faceCoordinates?: FaceCoordinates): ImageMetadata => ({
  id: `${file.name}-${Date.now()}`,
  url: URL.createObjectURL(file),
  file,
  faceCoordinates: faceCoordinates ?? {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
});

export const useAddCelebrity = () => {
  const t = useTranslations("CELEBRITYFACES");
  const tAdd = useTranslations("ADD");
  const router = useRouter();
  const { addImages, handleUpdatePlayer } = useImageSelectorStore();
  const { players, addPlayer } = usePlayerStore();
  const { setLoading } = useLoadingStore();
  const { addToast } = useToastStore();
  const { detectFaces, faceCropModel } = useFaceDetection();

  const handleAddCelebrity = useCallback(
    async (profile: CelebrityProfile) => {
      if (!faceCropModel) return;

      setLoading(true);

      try {
        const file = await fetchImageAsFile(profile.imageUrl, profile.id);
        const faceCoordinates = await detectFaces(file);
        const metadata = createImageMetadata(file, faceCoordinates);

        addImages([metadata]);

        if (!players.has(profile.name)) {
          addPlayer(profile.name, { id: profile.name, name: profile.name });
        }

        handleUpdatePlayer(metadata, profile.name);

        addToast({
          title: tAdd("PICTURE-SUCCESS"),
          description: tAdd("PICTURE-SUCCESS-DESC"),
          type: "success",
        });

        // 연예인 선택 후 faces 페이지로 이동
        router.push("/faces");
      } catch (error) {
        addToast({
          title: tAdd("PICTURE-FAIL"),
          description: t("SEARCH_ERROR", { name: profile.name }),
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      faceCropModel,
      setLoading,
      detectFaces,
      addImages,
      players,
      addPlayer,
      handleUpdatePlayer,
      addToast,
      tAdd,
      t,
      router,
    ]
  );

  return {
    handleAddCelebrity,
    faceCropModel,
  };
};
