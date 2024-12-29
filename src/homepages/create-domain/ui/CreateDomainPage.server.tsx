"use client";

import { Button, Form, IconButton, Input, LoadingSpinner, Tooltip } from "@/shared/ui";

import BlogDescriptionField from "./BlogDescriptionField";
import OgImageUploadField from "./OGImageUploadField";
import { useErrorBoundary, useSelector } from "@/shared/hooks";
import { validateInput } from "../utils";
import { Info } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { Provider } from "react-redux";
import { ALERT_DIALOG_SET_VISIBLE, configureAlertStore, useAlertDispatch, useAlertSelector } from "../models";
import ConfirmAlertDialog from "./ConfirmAlertDialog";
import { useRef, useState, useTransition } from "react";
import { set } from "zod";
import { isDomainAddressAlreadyRegistered } from "../api/action";

const RawBlogSettingPage = ({ title = "블로그 생성" }: { title?: string }) => {
  const user = useSelector((state) => state.auth.user);
  const isLogin = useSelector((state) => state.auth.isLogin);

  const alertDispatch = useAlertDispatch();
  const [pending, startTransition] = useTransition();
  const { setError } = useErrorBoundary();

  const formRef = useRef<HTMLFormElement>(null);

  /** 나중 react 19 useformstatus로 바꾸면됨 */
  const getFormData = () => {
    return new FormData(formRef.current!);
  };

  return (<>
    <main className="flex flex-col w-full items-center md:w-[768px] h-max min-h-[calc(100*var(--vh)-4rem)] mx-auto p-6 bg-background text-color-text-default shadow-md rounded-lg">
      <header className="mt-5 mb-6 flex flex-col gap-0 w-full h-inherit max-w-[25rem]">
        <h1 className="heading-01 text-color-text-discovery  text-2xl font-bold mb-2">{title}</h1>
        <p className="heading-03 text-color-text-accent-gray-default">
          블로그 이름과 검색에 도움이 되는 SEO 정보를 입력하세요.
        </p>
      </header>
      <Form
        ref={formRef}
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending) alertDispatch(ALERT_DIALOG_SET_VISIBLE(true));
        }}
        className="flex flex-col gap-4 w-full h-inherit max-w-[25rem] space-y-4"
      >
        <section className="space-y-4">
          <Form.Field name="subdomain" className="w-full space-y-3">
            <input className="hidden" type="hidden" name="userId" value={user?.id} />
            <Form.Label htmlFor="subdomain" className="relative flex flex-row items-center">
              블로그 주소 <Form.Required />
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
                  블로그의 주소로 사용됩니다. 32자내로 띄어쓰기 없이 영문만 입력 가능합니다.
                </Tooltip.Content>
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <Input
                id="subdomain"
                wrapperClassName="relative"
                className={`w-full h-[2rem] text-color-text-brand`}
                name="subdomain"
                defaultValue={""}
                required
              >
                {pending && (
                  <LoadingSpinner className="absolute -right-[0.2rem] top-[0.4rem] text-color-text-brand" />
                )}
              </Input>
            </Form.Control>

            <Form.Message match={(value, formData) => !/^[A-Za-z0-9]+$/g.test(value)}>
              영문 혹은 숫자만 입력 가능합니다.
            </Form.Message>
            <Form.Message className="FormMessage" match="valueMissing">
              블로그 주소을 입력하세요.
            </Form.Message>
            <Form.Message className="FormMessage" match={(value) => !(value.length <= 32)}>
              32자 이하로 입력하세요.
            </Form.Message>

            <Form.Message
              className="FormMessage"
              /** crazy? */
              match={async (value) => {
                return await new Promise((resolve, reject) => {
                  startTransition(async () => {
                    try {
                      const isDomainExist = await isDomainAddressAlreadyRegistered(value);
                      resolve(!!isDomainExist);
                    } catch (error) {
                      setError(error);
                    } finally {
                      reject(true);
                    }
                  });
                });
              }}
            >
              이미 있는 블로그 주소입니다.
            </Form.Message>
          </Form.Field>

          <Form.Field name="blogTitle" className="space-y-3">
            <Form.Label htmlFor="blogTitle" className="flex flex-row items-center">
              블로그 제목 <Form.Required />
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
                  블로그의 제목입니다. 블로그의 타이틀로 사용됩니다.
                </Tooltip.Content>
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <Input id="blogTitle" name="blogTitle" placeholder="나의 멋진 블로그" required />
            </Form.Control>
            <Form.Message match={(value, formData) => validateInput(value)}>
              특수문자는 허용되지 않습니다.
            </Form.Message>

            <Form.Message className="FormMessage" match="valueMissing">
              블로그의 제목을 입력하세요.
            </Form.Message>

            <Form.Message className="FormMessage" match={(value) => !(value.length <= 32)}>
              32자 이하로 입력하세요.
            </Form.Message>
          </Form.Field>

          <BlogDescriptionField />

          <LanguageSelector />

          <OgImageUploadField image={user?.image ?? ""} />
        </section>
        <footer className="mt-6">
          <Form.Submit asChild>
            <Button type="submit" className="w-full" disabled={pending || !isLogin}>
              {isLogin ? "블로그 생성" : "로그인 후 블로그 생성하기 "}
            </Button>
          </Form.Submit>
        </footer>
      </Form>
    </main>
    <ConfirmAlertDialog getFormData={getFormData} />
  </>);
};

const BlogSettingPage = () => {
  return (
    <Provider store={configureAlertStore}>
      <RawBlogSettingPage />
    </Provider>
  );
};

export default BlogSettingPage; 
