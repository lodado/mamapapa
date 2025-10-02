import { useCallback, useDeferredValue, useState } from "react";

import { useQueryContainer } from "@/shared/ui/QueryContainer";

import { CelebrityProfile } from "../configs/sampleCelebrities";

interface WikipediaPage {
  pageid: number;
  title: string;
  thumbnail?: {
    source: string;
  };
  description?: string;
}

const WIKIPEDIA_API_ENDPOINT = "https://en.wikipedia.org/w/api.php";

const buildTagsFromDescription = (description?: string): string[] => {
  if (!description) return [];

  return description
    .split(/[,/]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
};

const fetchCelebritiesFromWikipedia = async (query: string): Promise<CelebrityProfile[]> => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "pageimages|description",
    piprop: "thumbnail",
    pithumbsize: "640",
    generator: "search",
    gsrlimit: "12",
    gsrsearch: `${trimmedQuery} celebrity`,
    origin: "*",
  });

  const response = await fetch(`${WIKIPEDIA_API_ENDPOINT}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch celebrity data");
  }

  const data = await response.json();
  const pages: Record<string, WikipediaPage> | undefined = data?.query?.pages;

  if (!pages) {
    return [];
  }

  return Object.values(pages)
    .filter((page) => Boolean(page.thumbnail?.source))
    .map((page) => ({
      id: String(page.pageid),
      name: page.title,
      imageUrl: page.thumbnail!.source,
      tags: buildTagsFromDescription(page.description),
    }));
};

export const useCelebritySearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { query } = useQueryContainer({
    queryKey: ["celebrity-search", deferredSearchQuery],
    queryFn: () => {
      console.log("useCelebritySearch: Fetching celebrities for:", deferredSearchQuery);
      return fetchCelebritiesFromWikipedia(deferredSearchQuery);
    },
    queryOptions: {
      enabled: Boolean(deferredSearchQuery.trim()),
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1,
    },
  });

  const searchCelebrities = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearResults = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    results: query.data || [],
    searchCelebrities,
    isSearching: query.isFetching,
    clearResults,
    error: query.error,
    currentQuery: searchQuery,
    deferredQuery: deferredSearchQuery,
    isPending: searchQuery !== deferredSearchQuery,
  };
};

export type UseCelebritySearchReturn = ReturnType<typeof useCelebritySearch>;
