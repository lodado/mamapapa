import React from "react";

import { ConditionalGA } from "../CookieConsent/ui/ConditionalGA";

const GA = ({ nonce }: { nonce: string }) => {
  return <ConditionalGA nonce={nonce} />;
};

export default GA;
