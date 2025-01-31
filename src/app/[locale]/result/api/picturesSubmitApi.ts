"use server";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { ImageMetadata } from "@/features/ImageSelector/models";
import { supabaseInstance } from "@/shared/index.server";
import { NextResponse } from "next/server";

const getUniqueFileName = (originalFileName: string) => {
  const fileExtension = originalFileName?.split(".")?.pop() ?? "jpg"; // 확장자 추출
  const baseFileName = originalFileName?.split(".").slice(0, -1).join(".") ?? "default";

  // 중복 방지를 위해 시간 기반의 유니크 ID 추가
  const uniqueId = Date.now(); // 혹은 UUID 사용 가능
  return `${baseFileName}-${uniqueId}.${fileExtension}`;
};

// eslint-disable-next-line consistent-return
export async function picturesSubmitApi(formData: FormData) {
  try {
    const user = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

    if (!user) {
      return {
        message: "User not found",
      };
    }

    const size = Number(formData.get("size") ?? "0");

    const images = Array.from({
      length: size,
    }).map((_, index) => {
      const id = formData.get(`images[${index}][id]`) as string;
      // const faceCoordinates = JSON.parse(formData.get(`images[${index}][faceCoordinates]`) as string);
      const selectedPlayer = formData.get(`images[${index}][selectedPlayer]`) as string;
      const file = formData.get(`images[${index}][file]`) as File;
      return {
        id,
        url: "",
        file,
        // faceCoordinates,
        selectedPlayer,
      };
    }) as ImageMetadata[];

    for (let i = 0; i < size; i++) {
      const image = images[i];
      const fileName = getUniqueFileName(image.file.name);

      // Supabase Storage에 업로드
      const { data: storageData, error: storageError } = await supabaseInstance.storage
        .from("images")
        .upload(fileName, image.file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) {
        console.error(`Storage upload error:`, storageError);
        return {
          message: "storage Database Error: Failed to save image",
        };
      }

      console.log(`Uploaded file: ${fileName}`, storageData);

      images[i].url = storageData.fullPath;
    }

    // (2) Supabase DB에 메타데이터 저장
    //     - faceCoordinates와 embedding 등을 JSON/배열 형태로 삽입
    //     - embedding은 float 배열(float8[])로 저장 가능
    const { data, error } = await supabaseInstance
      .from("images") // table 이름
      .insert(
        images.map((image: ImageMetadata) => ({
          id: image.id,
          url: image.url,
          selectedPlayer: image.selectedPlayer ?? null,
          userId: user.id,
        }))
      )
      .select(); // 삽입 후 반환받고 싶으면 select()

    if (error) {
      console.error(`Insert error:`, error);
      return {
        message: "storage Database Error: Failed to save image to db",
      };
    }

    return {
      message: "Success",
      data: data,
    };
  } catch (error: any) {
    return {
      message: `Server Error, ${error.message}`,
    };
  }
}
