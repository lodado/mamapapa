import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui";

import { CelebrityProfile } from "../configs/sampleCelebrities";
import { CELEBRITY_TUTORIAL_IDS } from "../configs/tutorialConstants";

interface CelebrityCardProps {
  profile: CelebrityProfile;
  onAdd: (profile: CelebrityProfile) => void;
  isDisabled?: boolean;
  isTutorialCard?: boolean;
}

export const CelebrityCard = ({ profile, onAdd, isDisabled = false, isTutorialCard = false }: CelebrityCardProps) => {
  const t = useTranslations("CELEBRITYFACES");

  return (
    <article
      key={profile.id}
      id={isTutorialCard ? CELEBRITY_TUTORIAL_IDS.CELEBRITY_CARD : profile.id}
      aria-label={`${profile.name}`}
      className="flex flex-col gap-3 rounded-xl border border-border-02 bg-background-02 p-4 shadow-sm"
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-background-01">
        <Image
          src={profile.imageUrl}
          alt={t("IMAGE_ALT", { name: profile.name })}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
          unoptimized
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="subhead-2 text-text-01">{profile.name}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-text-03">
          {profile.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-background-op-02 px-2 py-1">
              #{tag}
            </span>
          ))}
        </div>
        <Button
          id={isTutorialCard ? CELEBRITY_TUTORIAL_IDS.ADD_BUTTON : undefined}
          variant="primarySolid"
          disabled={isDisabled}
          onClick={() => onAdd(profile)}
        >
          {t("ADD_BUTTON")}
        </Button>
      </div>
    </article>
  );
};
