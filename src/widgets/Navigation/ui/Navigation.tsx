import React, { PropsWithChildren, ReactNode, useState } from "react";

import { LoginButton } from "@/features";
import { Bell, SquarePen } from "lucide-react";
import { IconButton } from "@/shared/ui";
import { NavigationProvider } from "./Login/NavContext";
import { Logo } from "./Login/components/Logo";
import ProfileDropdown from "./Login/components/ProfileSelector";
import { AuthRepositoryImpl, GetUserInfoUseCase } from "@/entities/Auth/core";
import { ServerLocaleLink } from "@/shared/ui/index.server";

import { GetDomainByUserIdUseCase } from "@/features/blog/domain/models";
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";

const LoginNavBarRoot = async ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavigationProvider>
        <nav className="page-nav w-screen grow-0 shrink-0 top-0 bg-background text-color-text-default z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[64px] px-5">{children}</div>
          </div>
        </nav>
      </NavigationProvider>
    </>
  );
};

const Header = ({ mobileChildren }: { mobileChildren?: ReactNode }) => (
  <>
    <div className="w-[52px] flex-grow-0 flex sm:hidden items-center">{mobileChildren}</div>
    <div className=" hidden sm:flex items-center flex-grow-0 flex-shrink-0 flex-row gap-5">
      <Logo />
    </div>
  </>
);

const Body = () => (
  <>
    <div className="sm:hidden flex pl-3 flex-grow items-center justify-center flex-row gap-5">
      <Logo />
    </div>
    {/* Mobile menu button, consider for responsiveness */}
    {/* <MobileMenuToggleButton /> */}
    {/* <MobileMenuDropdown navLinks={navLinks} /> */}
  </>
);


/** 나중 시안대로 바꿀꺼임 */
const Footer = async ({ children, authRepository }: { children?: ReactNode; authRepository: AuthRepositoryImpl }) => {
  const isLogin = await new GetUserInfoUseCase(authRepository).isUserLogin();

  return (
    <div className="flex flex-grow-0">
      <div className="flex min-w-[90px] items-center gap-4 flex-row justify-end">
        {isLogin ? (
          <>
            {children}

            <IconButton variant="text">
              <Bell />
            </IconButton>
            <ProfileDropdown />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

const LoginNavBar = {
  Root: LoginNavBarRoot,
  Header,
  Body,
  Footer,
};

export default LoginNavBar;
