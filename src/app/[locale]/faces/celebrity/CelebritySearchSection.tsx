"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useTutorialStore } from "@/entities/Tutorial";

import { CelebrityGrid } from "./components/CelebrityGrid";
import { SearchInput } from "./components/SearchInput";
import { useAddCelebrity } from "./hooks/useAddCelebrity";
import { useCelebrityDisplay } from "./hooks/useCelebrityDisplay";
import { useCelebritySearch } from "./hooks/useCelebritySearch";

const CelebritySearchSection = () => {
  const t = useTranslations("CELEBRITYFACES");
  const [query, setQuery] = useState("");
  const { results: searchResults, isSearching, error, isPending } = useCelebritySearch(query);
  const { handleAddCelebrity, faceCropModel } = useAddCelebrity();
  const { run: isTutorialRunning } = useTutorialStore();

  const { displayCelebrities, isLoading } = useCelebrityDisplay({
    query,
    searchResults,
    isSearching,
    isPending,
  });

  return (
    <section className="w-full mt-[6.25rem] px-4">
      <SearchInput value={query} onChange={setQuery} />

      {error ? (
        <p className="body-2 text-text-03">{t("SEARCH_GENERAL_ERROR")}</p>
      ) : (
        <CelebrityGrid
          celebrities={displayCelebrities}
          isSearching={isLoading}
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
