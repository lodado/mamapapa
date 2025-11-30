import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

import { queryClientOption } from "./queryClientOption";

export function getServerQueryClient() {
  return cache(() => new QueryClient(queryClientOption as any));
}
