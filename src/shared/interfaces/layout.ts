import { ReactNode } from "react";

export type LocaleProps = { children?: ReactNode; params: Promise<{ locale: string }> };
