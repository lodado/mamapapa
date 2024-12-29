import { ScreenReaderOnly } from "@/shared/ui";
import React from "react";

import Image from "next/image";

import LogoSvg from "./Logo.svg";
import { Paytone_One } from "next/font/google";

const paytoneOne = Paytone_One({
  subsets: ["latin"],
  weight: "400", // Specify the weight if applicable
  display: "swap", // Optimize font display
});

const Logo = () => {
  return (
    <>
      <figure
        lang="en"
        className="flex w-full h-full flex-row items-center justify-center heading-02 font-extrabold text-color-text-default gap-1"
      >
        <Image src={LogoSvg} width={28} height={28} alt="logo" />
        <figcaption className="select-none text-color-text-default">
          <span
            className={`w-[28px] h-[10px] text-color-text-default ${paytoneOne.className}`}
            style={{
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            unio
          </span>
          <ScreenReaderOnly>
            is a blogging platform that automatically translates your posts into multiple languages, enabling you to
            effortlessly reach and engage a global audience.
          </ScreenReaderOnly>
        </figcaption>
      </figure>
    </>
  );
};

export default Logo;
