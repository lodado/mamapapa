"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import { USER_PLAYER_NAME } from "@/entities";
import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { IndexedDBController } from "@/shared";
import { useServerAction } from "@/shared/hooks";
import { Button } from "@/shared/ui";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { cosineSimilarity, cosineToPercentage } from "@/widgets/ImagePrediction";

import { picturesSubmitApi } from "../api/picturesSubmitApi";

const ShareButton = () => {
  const imageContainer = useMemo(() => new IndexedDBController<ImageMetadata[]>("IMG_CONTAINER"), []);
  const { onSubmit } = useServerAction(picturesSubmitApi);
  const { isLoading, setLoading } = useLoadingStore();

  const { isLogin, setIsLogin } = useAuthStore();
  const { images, setImages } = useImageSelectorStore();
  const router = useRouter();

  const handleSubmitFormData = async () => {
    setLoading(true);
    const playerImage = images.find((image) => image.selectedPlayer === USER_PLAYER_NAME)!;

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        Object.entries(image).forEach(([key, value]) => {
          if (key === "embedding") {
            const similarity = image?.embedding
              ? cosineToPercentage(cosineSimilarity(playerImage!.embedding!, image.embedding!))
              : 0;
            formData.append(`images[${index}][similarity]`, String(similarity ?? 0));
            return;
          }

          if (!Array.isArray(value)) {
            formData.append(`images[${index}][${key}]`, value);
          }
          if (value instanceof Object) {
            formData.append(`images[${index}][${key}]`, JSON.stringify(value));
          }
        });
      });

      formData.append("size", images.length.toString());

      const data = (await onSubmit(formData)) as { data: { id: string | number }[] };

      const { id } = data?.data?.[0];
      router.push(`/history/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleShareButtonClick = useCallback(async () => {
    if (!isLogin) {
      // 팝업(새 창)을 연다.
      const popup = window.open(
        "/login-popup", // 로그인 폼을 보여줄 라우트(아래에서 설명)
        "loginPopup",
        "width=500,height=600"
      );

      // popup이 정상적으로 열렸다면, 부모창에서 popup의 메시지를 기다린다.
      if (popup) {
        const handleMessage = async (event: MessageEvent) => {
          /**
           * 보안 상의 이유로 event.origin 체크 로직을 추가하는 것을 추천합니다.
           * 예: if (event.origin !== "https://내도메인") return;
           */

          if (event.data === "LOGIN_SUCCESS") {
            // 로그인 성공 시, AuthStore 등에서 상태 갱신

            setIsLogin(true);
          }
        };

        window.addEventListener("message", handleMessage);

        // 필요에 따라 cleanup
        const timer = setInterval(() => {
          // 혹시 사용자가 팝업을 수동으로 닫았을 경우, 이벤트 리스너 정리
          if (popup.closed) {
            clearInterval(timer);
            window.removeEventListener("message", handleMessage);
          }
        }, 500);
      }
    } else {
      handleSubmitFormData();
    }
  }, [isLogin, setIsLogin, images]);

  return (
    <div className="w-full flex items-center max-w-[29rem]">
      <Button
        className="w-full"
        variant="primaryLine"
        onClick={handleShareButtonClick}
        disabled={isLoading && !images.every((image) => image.embedding != undefined)}
      >
        공유하기
      </Button>
    </div>
  );
};

export default ShareButton;
