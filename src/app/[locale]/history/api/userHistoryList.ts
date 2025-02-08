import { supabaseInstance } from "@/shared/index.server";

import { HistoryResponse } from "../stores/type";

/*
TO DO - 나중 수정
export const getUserHistoryList = ({ userId, pageParam }: { userId: string; pageParam: number }) =>
  unstable_cache(
    async () => {
      const result = await supabaseInstance
        .from("simminyResults")
        .select(`title, description, id, createdAt, updatedAt`)
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .range(0, 500);

      return result;
    },
    ["user-history", userId],
    { revalidate: 5, tags: [`user-history-${userId}`] }
  );
*/

export const getUserHistoryList =
  ({ userId, pageParam }: { userId: string; pageParam: number }) =>
  async () => {
    const { data, error } = await supabaseInstance
      .from("simminyResultCommentCount")
      .select(`title, description, id, updatedAt, commentCount`)
      .eq("userId", userId)
      .order("updatedAt", { ascending: false })
      .range(0, 500);

    if (error) {
      throw error;
    }

    return data as HistoryResponse[];
  };
