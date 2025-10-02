"use client";

import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { useTutorialStore } from "@/entities/Tutorial";

import { CelebrityGrid } from "./components/CelebrityGrid";
import { SearchInput } from "./components/SearchInput";
import { CELEBRITY_PROFILES, CelebrityProfile } from "./configs/sampleCelebrities";
import { useAddCelebrity } from "./hooks/useAddCelebrity";
import { useCelebritySearch } from "./hooks/useCelebritySearch";

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const CelebritySearchSection = () => {
  const t = useTranslations("CELEBRITYFACES");
  const [query, setQuery] = useState("");
  const { results: searchResults, isSearching, error } = useCelebritySearch(query);
  const { handleAddCelebrity, faceCropModel } = useAddCelebrity();
  const { run: isTutorialRunning } = useTutorialStore();

  const normalizedQuery = useMemo(() => normalizeText(query), [query]);

  const filteredCelebrities = useMemo(() => {
    if (!normalizedQuery) return CELEBRITY_PROFILES;

    return CELEBRITY_PROFILES.filter((profile) => {
      const normalizedName = normalizeText(profile.name);
      const normalizedTags = profile.tags.map(normalizeText);

      return normalizedName.includes(normalizedQuery) || normalizedTags.some((tag) => tag.includes(normalizedQuery));
    });
  }, [normalizedQuery]);

  const shouldShowSearchResults = Boolean(normalizedQuery) && (isSearching || searchResults.length > 0);
  const displayCelebrities = shouldShowSearchResults ? searchResults : filteredCelebrities;

  return (
    <section className="w-full mt-[6.25rem] px-4">
      <SearchInput value={query} onChange={setQuery} />

      {error ? (
        <p className="body-2 text-text-03">{t("SEARCH_GENERAL_ERROR")}</p>
      ) : (
        <CelebrityGrid
          celebrities={displayCelebrities}
          isSearching={isSearching}
          onAddCelebrity={handleAddCelebrity}
          isDisabled={!faceCropModel}
          searchQuery={query}
          showTutorialCard={isTutorialRunning}
        />
      )}
    </section>
  );
};

export default CelebritySearchSection;
