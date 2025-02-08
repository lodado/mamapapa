import { revalidateTag, unstable_cache } from "next/cache";

import { postRevalidateTag } from "@/entities/revalidate/api/api";
import { supabaseInstance } from "@/shared/index.server";

export const getCachedCompareHistory = (id: string) =>
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
    { revalidate: 5000, tags: [`history-${id}`] }
  );

export const removeCompareHistory = async (id: string) => {
  const result = await supabaseInstance.from("simminyResults").delete().eq("id", id);
  await postRevalidateTag({ tagName: `history-${id}` });

  return result;
};

export const updateCompareHistory = async (id: string, title: string) => {
  const result = await supabaseInstance.from("simminyResults").update({ title }).eq("id", id);
  await postRevalidateTag({ tagName: `history-${id}` });

  return result;
};
