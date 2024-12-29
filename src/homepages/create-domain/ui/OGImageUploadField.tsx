"use client";

import { Form, IconButton, ScreenReaderOnly, Tooltip } from "@/shared/ui";
import { Info } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function OgImageUploadField({ image }: { image: string }) {
  const [ogImage, setOgImage] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setOgImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <Form.Field {...getRootProps()} id="OG-image" className="flex flex-col gap-4">
      <Form.Label htmlFor="OG-image" className="flex flex-row items-center">
        블로그 아이콘 업로드
        <Tooltip>
          <Tooltip.Trigger>
            <IconButton
              size="small"
              className="disabled:text-color-text-default disabled:opacity-80 ml-1"
              variant="text"
              disabled
            >
              <Info />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content align="center" side="top" variant="editor" className="-mt-[2.5rem]">
            블로그의 대표 이미지입니다. 48 x 48 정도의 작은 아이콘을 입력하세요.
          </Tooltip.Content>
        </Tooltip>
      </Form.Label>

      <div
        className={`border-2 border-dashed rounded-md p-4 space-y-2 text-center cursor-pointer ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        {ogImage ? (
          `선택된 파일: ${ogImage.name}`
        ) : (
          <>{isDragActive ? "여기에 파일을 놓으세요" : "이미지를 드래그하거나 클릭하여 업로드하세요"}</>
        )}

        <Form.Control asChild>
          <input {...getInputProps()} name="ogImage" />
        </Form.Control>
      </div>
    </Form.Field>
  );
}
