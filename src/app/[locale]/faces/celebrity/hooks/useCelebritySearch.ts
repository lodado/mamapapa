import { keepPreviousData } from "@tanstack/react-query";

import { useDebouncedQuery } from "@/shared/hooks";
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
const SEARCH_DEBOUNCE_DELAY = 700; // milliseconds

const buildTagsFromDescription = (description?: string): string[] => {
  if (!description) return [];

  return description
    .split(/[,/]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
};

const fetchCelebritiesFromWikipedia = async (query: string, signal?: AbortSignal): Promise<CelebrityProfile[]> => {
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

  const response = await fetch(`${WIKIPEDIA_API_ENDPOINT}?${params.toString()}`, {
    signal,
  });

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

export const useCelebritySearch = (searchQuery: string) => {
  const debouncedQuery = useDebouncedQuery(searchQuery, SEARCH_DEBOUNCE_DELAY);

  const { query } = useQueryContainer({
    queryKey: ["celebrity-search", debouncedQuery],
    queryFn: ({ signal }) => {
      return fetchCelebritiesFromWikipedia(debouncedQuery, signal);
    },
    queryOptions: {
      enabled: Boolean(debouncedQuery.trim()),
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1,
      placeholderData: keepPreviousData,
    },
  });

  return {
    results: query.data || [],
    isSearching: query.isFetching,
    error: query.error,
    currentQuery: searchQuery,
    debouncedQuery,
    isPending: searchQuery !== debouncedQuery,
  };
};

export type UseCelebritySearchReturn = ReturnType<typeof useCelebritySearch>;
