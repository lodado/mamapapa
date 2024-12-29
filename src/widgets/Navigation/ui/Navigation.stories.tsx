// Navigation.stories.tsx
import type { StoryObj } from "@storybook/react";
import Navigation from "./Navigation";
import { AuthRepositoryImpl, UserEntity } from "@/entities/Auth/core";
import { Suspense } from "react";

const meta = {
  title: "Widgets/Navigation",

  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    isRSC: true,
  },
};

export default meta;

type Story = StoryObj<typeof Navigation>;

// 사이드바가 닫힌 상태의 스토리
export const LoginUserNav = () => {
  return (
    <Suspense>
      <Navigation.Root>
        <Navigation.Header />
        <Navigation.Footer
          {...{
            authRepository: new (class Mock implements AuthRepositoryImpl {
              login(): Promise<void> {
                throw new Error("Method not implemented.");
              }
              logout(): Promise<void> {
                throw new Error("Method not implemented.");
              }
              getUserInfo(): Promise<UserEntity | undefined> {
                return Promise.resolve(
                  new UserEntity({ id: "test", name: "test", email: "test", image: "https://picsum.photos/200" })
                );
              }
            })(),
          }}
        />
      </Navigation.Root>
    </Suspense>
  );
};

// 사이드바가 닫힌 상태의 스토리
export const NotLoginUserNav = () => {
  return (
    <Suspense>
      <Navigation.Root>
        <Navigation.Header />
        <Navigation.Footer
          {...{
            authRepository: new (class Mock implements AuthRepositoryImpl {
              login(): Promise<void> {
                throw new Error("Method not implemented.");
              }
              logout(): Promise<void> {
                throw new Error("Method not implemented.");
              }
              getUserInfo(): Promise<UserEntity | undefined> {
                return Promise.resolve(undefined);
              }
            })(),
          }}
        />
      </Navigation.Root>
    </Suspense>
  );
};
