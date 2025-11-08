import React from "react";

import { GAConsentMode } from "./GAConsentMode";

const GA = ({ nonce }: { nonce: string }) => {
  return <GAConsentMode nonce={nonce} />;
};

export default GA;
