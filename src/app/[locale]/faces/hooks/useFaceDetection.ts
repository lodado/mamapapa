import { useCallback } from "react";

import { useFaceModelStore } from "@/features/AiModel/model";
import { FaceCoordinates } from "@/features/ImageSelector/models";

export const useFaceDetection = () => {
  const { faceCropModel } = useFaceModelStore();

  const detectFaces = useCallback(
    async (file: File): Promise<FaceCoordinates | undefined> => {
      if (!faceCropModel) return undefined;

      const img = new Image();
      const imgURL = URL.createObjectURL(file);
      img.src = imgURL;

      return new Promise((resolve) => {
        img.onload = async () => {
          try {
            const predictions = await faceCropModel.estimateFaces(img, false);

            if (predictions.length === 0) {
              resolve({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
              });
              return;
            }

            const face = predictions[0];
            const [x, y] = face.topLeft as [number, number];
            const [rx, ry] = face.bottomRight as [number, number];
            const width = rx - x;
            const height = ry - y;

            resolve({
              x,
              y,
              width,
              height,
            });
          } catch (error) {
            resolve({
              x: 0,
              y: 0,
              width: 0,
              height: 0,
            });
          } finally {
            URL.revokeObjectURL(imgURL);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(imgURL);
          resolve({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          });
        };
      });
    },
    [faceCropModel]
  );

  return { faceCropModel, detectFaces };
};
