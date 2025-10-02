import { useMemo } from "react";

import { normalizeText } from "@/shared/utils";

import { CELEBRITY_PROFILES, CelebrityProfile } from "../configs/sampleCelebrities";

interface UseCelebrityDisplayProps {
  query: string;
  searchResults: CelebrityProfile[];
  isSearching: boolean;
}

export const useCelebrityDisplay = ({ query, searchResults, isSearching }: UseCelebrityDisplayProps) => {
  const displayCelebrities = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    const hasQuery = Boolean(normalizedQuery);
    const shouldShowSearchResults = hasQuery && (isSearching || searchResults.length > 0);

    if (shouldShowSearchResults) {
      return searchResults;
    }

    // Local filtering when no search results
    if (!hasQuery) return CELEBRITY_PROFILES;

    return CELEBRITY_PROFILES.filter((profile) => {
      const normalizedName = normalizeText(profile.name);
      const normalizedTags = profile.tags.map(normalizeText);

      return normalizedName.includes(normalizedQuery) || normalizedTags.some((tag) => tag.includes(normalizedQuery));
    });
  }, [query, isSearching, searchResults]);

  return {
    displayCelebrities,
    hasQuery: Boolean(normalizeText(query)),
  };
};
