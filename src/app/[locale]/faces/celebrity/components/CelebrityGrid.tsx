import { useTranslations } from "next-intl";

import { CelebrityProfile } from "../configs/sampleCelebrities";
import { CelebrityCard } from "./CelebrityCard";
import { SkeletonCard } from "./SkeletonCard";

interface CelebrityGridProps {
  celebrities: CelebrityProfile[];
  isSearching: boolean;
  onAddCelebrity: (profile: CelebrityProfile) => void;
  isDisabled?: boolean;
  searchQuery?: string;
  showTutorialCard?: boolean;
}

export const CelebrityGrid = ({
  celebrities,
  isSearching,
  onAddCelebrity,
  isDisabled = false,
  searchQuery = "",
  showTutorialCard = false,
}: CelebrityGridProps) => {
  const t = useTranslations("CELEBRITYFACES");

  if (isSearching) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} index={index} />
        ))}
      </div>
    );
  }

  if (celebrities.length === 0 && !showTutorialCard) {
    return <p className="body-2 text-text-03">{t("SEARCH_EMPTY", { query: searchQuery })}</p>;
  }

  // 튜토리얼 카드가 필요한 경우 첫 번째 연예인을 튜토리얼 카드로 표시
  const displayCelebrities =
    showTutorialCard && celebrities.length > 0 ? [celebrities[0], ...celebrities.slice(1)] : celebrities;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {displayCelebrities.map((profile, index) => (
        <CelebrityCard
          key={profile.id}
          profile={profile}
          onAdd={onAddCelebrity}
          isDisabled={isDisabled}
          isTutorialCard={showTutorialCard && index === 0}
        />
      ))}
    </div>
  );
};
