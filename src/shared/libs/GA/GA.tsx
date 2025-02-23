import Script from "next/script";
import React from "react";

import { GA_KEY } from "./constant";
import GAClient from "./GAClient";

const GA = ({ nonce }: { nonce: string }) => {
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_KEY}`} nonce={nonce} />
      <GAClient nonce={nonce} />
    </>
  );
};

export default GA;
