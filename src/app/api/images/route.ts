import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";

import { ImageMetadata } from "@/features/ImageSelector/models";
import { supabaseInstance } from "@/shared/index.server";

import { NextRequest, NextResponse } from "next/server";

// POST /api/images
export async function POST(request: NextRequest) {
  const user = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { images } = (await request.json()) as { images: ImageMetadata[] };

    for (const image of images) {
      const fileExtension = image.file.name?.split(".")?.pop() ?? "jpg";
      const fileName = `${image.id}.${fileExtension}`;

      // Supabase Storage에 업로드
      // 여기서는 예시로 images 라는 버킷을 사용했다고 가정합니다.
      const { data: storageData, error: storageError } = await supabaseInstance.storage
        .from("images")
        // 실제로는 File이 아니라면, 업로드 로직 조정 필요
        .upload(fileName, image.file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (storageError) {
        console.error(`Storage upload error:`, storageError);
        return NextResponse.json({ error: storageError.message }, { status: 500 });
      }

      console.log(`Uploaded file: ${fileName}`, storageData);
    }

    // (2) Supabase DB에 메타데이터 저장
    //     - faceCoordinates와 embedding 등을 JSON/배열 형태로 삽입
    //     - embedding은 float 배열(float8[])로 저장 가능
    const { data, error } = await supabaseInstance
      .from("images") // table 이름
      .insert(
        images.map((image) => ({
          id: image.id,
          url: image.url,
          faceCoordinates: image.faceCoordinates, // jsonb
          selectedPlayer: image.selectedPlayer ?? null,
          userId: user.id,
        }))
      )
      .select(); // 삽입 후 반환받고 싶으면 select()

    if (error) {
      console.error(`Insert error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 성공 시 응답
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error(`POST /api/images error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
