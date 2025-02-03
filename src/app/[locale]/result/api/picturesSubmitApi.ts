"use server";

import { v4 as uuidv4 } from "uuid";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { ImageMetadata } from "@/features/ImageSelector/models";
import { STORAGE_PATH } from "@/shared";
import { supabaseInstance } from "@/shared/index.server";
import setCircuitBreaker from "@/shared/libs/Redis/setCircuitBreaker";

const getUniqueFileName = (originalFileName: string) => {
  const fileExtension = originalFileName?.split(".")?.pop() ?? "jpg"; // 확장자 추출
  const baseFileName = originalFileName?.split(".").slice(0, -1).join(".") ?? "default";

  // 중복 방지를 위해 UUID 사용
  const uniqueId = uuidv4();
  return `${baseFileName}-${uniqueId}.${fileExtension}`;
};

const getCircuitBreakerId = (id: string | number) => `picturesSubmitApiUser${id}`;
const CIRCUIT_BREAKER_LIMIT = 12;

 
export async function picturesSubmitApi(formData: FormData) {
  try {
    const user = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

    if (!user) {
      return {
        message: "User not found",
      };
    }

    const { error: circutBreakError, message } = await setCircuitBreaker(
      getCircuitBreakerId(user.id),
      CIRCUIT_BREAKER_LIMIT
    );

    if (circutBreakError) {
      return {
        message: message,
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

      const similarity = formData.get(`images[${index}][similarity]`);

      return {
        id,
        url: "",
        file,
        // faceCoordinates,
        selectedPlayer,
        similarity,
      };
    });

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

      images[i].url = STORAGE_PATH + storageData.fullPath;
    }

    // (2) Supabase DB에 메타데이터 저장

    const insertData = {
      title: "이미지 비교 결과",
      description: null,

      imageList: JSON.stringify(
        images.map((image) => ({
          id: image.id,
          url: image.url,
          selectedPlayer: image.selectedPlayer ?? null,
          similarity: image.similarity ?? 0,
        }))
      ),
      userId: user.id,
    };

    const { data, error } = await supabaseInstance
      .from("simminyResults") // table 이름
      .insert([insertData])
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
