import { cache } from "react";

const rawParseServerCookie = async () => {
  const cookieStore = await (await import("next/headers")).cookies();
  const cookieString = cookieStore
    .getAll()
    .filter(({ name }) => /authjs/.test(name))

    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return cookieString;
};

export const parseServerCookie = async () => {
  return rawParseServerCookie();
};
