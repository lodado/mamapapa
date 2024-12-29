"use client";

import React from "react";
import Link from "next/link";
import { Dropdown, LocaleLink } from "@/shared/ui";
import { LogoutButton } from "@/features";
import { useSelector } from "@/shared/hooks";
import { User, Settings } from "lucide-react";

import ProfileThemeSelector from "./ProfileThemeSelector";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/features/Settings";

const ProfileDropdown = () => {
  const t = useTranslations("ProfileDropdown");
  const user = useSelector((state) => state.auth.user);
  const userDomainLocation = useSelector((state) => state.userDomain.domainLocation);

  return (
    <Dropdown>
      <Dropdown.Trigger
        variant="custom"
        className="cursor-pointer flex w-[36px] h-[36px] justify-center items-center px-0 m-2"
      >
        <UserProfile src={user.image ?? ""} width={36} height={36} alt="user profile" />
      </Dropdown.Trigger>
      <Dropdown.Content align="end" className="w-64 py-3 ">
        <div className="p-2 bg-background">
          <div className="flex items-center gap-3">
            <UserProfile src={user.image ?? ""} width={48} height={48} alt="user profile" />
            <div>
              <p className="heading-02 text-color-text-default">{user?.name ?? ""}</p>
              <p className="body-02 text-color-text-default opacity-70">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>

        <Dropdown.Separator className="my-0.5" />

        <ProfileThemeSelector />

        <Dropdown.Separator className="my-2" />

        <div className="flex flex-col py-2 gap-y-2">
          {userDomainLocation !== "" ? (
            <LocaleLink subDomain={userDomainLocation} href="">
              <Dropdown.Item className="flex items-center justify-start w-full px-4 gap-2">
                <User className="" size={22} />
                <span className="body-02">{t("my_blog")}</span>
              </Dropdown.Item>
            </LocaleLink>
          ) : (
            <LocaleLink subDomain="www" href="/create-blog">
              <Dropdown.Item className="flex items-center justify-start w-full px-4 gap-2">
                <User className="" size={22} />
                <span className="body-02">블로그 만들기</span>
              </Dropdown.Item>
            </LocaleLink>
          )}

          <Dropdown.Item className="flex items-center justify-start px-4  gap-2">
            <Settings className="" size={22} />
            <span className="body-02">{t("settings")}</span>
          </Dropdown.Item>
        </div>

        <Dropdown.Separator className="my-2" />

        <Dropdown.Item
          className="px-2 py-5 text-color-text-danger 
        data-[highlighted]:text-color-text-danger data-[highlighted]:font-bold "
        >
          <LogoutButton />
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default ProfileDropdown;
