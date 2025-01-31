"use client";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { Button } from "@/shared/ui";
import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IndexedDBController, request } from "@/shared";
import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";

const ShareButton = () => {
  const imageContainer = useMemo(() => new IndexedDBController<ImageMetadata[]>("IMG_CONTAINER"), []);

  const { isLogin, setIsLogin } = useAuthStore();
  const { images, setImages } = useImageSelectorStore();
  const router = useRouter();

  useEffect(() => {
    const req = async () => {
      try {
        const data = await request({
          method: "POST",
          url: "/api/images",
          data: images,
        });

        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    req();
  }, []);

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
            popup.close();
            try {
              const data = await request({ method: "POST", url: "/api/images" });
              console.log(data);
            } catch (e) {
              console.log(e);
            }
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
    }
  }, [isLogin, setIsLogin]);

  return (
    <div className="w-full flex items-center max-w-[29rem]">
      <Button className="w-full" variant="primaryLine" onClick={handleShareButtonClick}>
        공유하기
      </Button>
    </div>
  );
};

export default ShareButton;
