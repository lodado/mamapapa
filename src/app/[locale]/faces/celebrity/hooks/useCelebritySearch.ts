import { useCallback, useRef, useState } from "react";

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

export const useCelebritySearch = () => {
  const [results, setResults] = useState<CelebrityProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearResults = useCallback(() => {
    abortControllerRef.current?.abort();
    setResults([]);
    setIsSearching(false);
  }, []);

  const searchCelebrities = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        clearResults();
        return [];
      }

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSearching(true);

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

      try {
        const response = await fetch(`${WIKIPEDIA_API_ENDPOINT}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch celebrity data");
        }

        const data = await response.json();
        const pages: Record<string, WikipediaPage> | undefined = data?.query?.pages;

        if (!pages) {
          setResults([]);
          return [];
        }

        const parsedResults = Object.values(pages)
          .filter((page) => Boolean(page.thumbnail?.source))
          .map((page) => ({
            id: String(page.pageid),
            name: page.title,
            imageUrl: page.thumbnail!.source,
            tags: buildTagsFromDescription(page.description),
          }));

        setResults(parsedResults);

        return parsedResults;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return [];
        }

        console.error(error);
        setResults([]);

        return [];
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [clearResults],
  );

  return {
    results,
    searchCelebrities,
    isSearching,
    clearResults,
  };
};

export type UseCelebritySearchReturn = ReturnType<typeof useCelebritySearch>;
