"use client";

import { Form, IconButton, TextArea, Tooltip } from "@/shared/ui";
import React, { useState, useEffect } from "react";
import { validateInput } from "../utils/validateInput";
import { Info } from "lucide-react";

const translateToEnglish = async (text: string): Promise<string> => {
  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: "ko",
      target: "en",
    }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.translatedText;
};

export default function BlogDescriptionField() {
  return (
    <>
      <Form.Field name="blogDescription" className="flex items-start w-full flex-col space-y-2">
        <Form.Label htmlFor="blogDescription" className="flex flex-row items-center">
          블로그 설명
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
              블로그를 잘 설명할 수 있는 주제로 설정하세요. 검색에 도움이 됩니다.
            </Tooltip.Content>
          </Tooltip>
        </Form.Label>
        <Form.Control asChild>
          <TextArea
            id="blogDescription"
            name="blogDescription"
            className="w-full mih-h-[6rem]"
            placeholder="이 블로그는..."
            required
          />
        </Form.Control>

        <Form.Message className="text-start" match={(value, formData) => validateInput(value)}>
          특수문자는 허용되지 않습니다.
        </Form.Message>

        <Form.Message className="FormMessage" match="valueMissing">
          블로그 제목을 입력하세요.
        </Form.Message>

        <Form.Message className="FormMessage" match={(value) => !(value.length <= 100)}>
          100자 이하로 입력하세요.
        </Form.Message>
      </Form.Field>
    </>
  );
}
