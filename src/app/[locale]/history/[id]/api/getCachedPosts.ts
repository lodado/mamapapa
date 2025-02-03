import { unstable_cache } from "next/cache";

import { supabaseInstance } from "@/shared/index.server";

export const getCachedPosts = (id: string) =>
  unstable_cache(
    async () => {
      const result = await supabaseInstance
        .from("simminyResults")
        .select(
          `
      *
    `
        )
        .eq("id", id)
        .single();

      return result;
    },
    ["history", id],
    { revalidate: 20, tags: ["history", id] }
  );
