"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { usePlayerStore } from "@/entities/Player";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { Button, Input } from "@/shared/ui";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { useFaceDetection } from "../../hooks/useFaceDetection";
import { CELEBRITY_PROFILES, CelebrityProfile } from "../configs/sampleCelebrities";

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const fetchImageAsFile = async (imageUrl: string, filename: string) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch celebrity image");
  }

  const blob = await response.blob();
  const extension = blob.type.split("/").pop() ?? "jpg";

  return new File([blob], `${filename}.${extension}`, { type: blob.type });
};

const createImageMetadata = (file: File, faceCoordinates?: FaceCoordinates): ImageMetadata => ({
  id: `${file.name}-${Date.now()}`,
  url: URL.createObjectURL(file),
  file,
  faceCoordinates: faceCoordinates ?? {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
});

const CelebritySearchSection = () => {
  const t = useTranslations("CELEBRITYFACES");
  const tAdd = useTranslations("ADD");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { addImages, handleUpdatePlayer } = useImageSelectorStore();
  const { players, addPlayer } = usePlayerStore();
  const { setLoading } = useLoadingStore();
  const { addToast } = useToastStore();
  const { detectFaces, faceCropModel } = useFaceDetection();

  const normalizedQuery = useMemo(() => normalizeText(query), [query]);

  const filteredCelebrities = useMemo(() => {
    if (!normalizedQuery) return CELEBRITY_PROFILES;

    return CELEBRITY_PROFILES.filter((profile) => {
      const normalizedName = normalizeText(profile.name);
      const normalizedTags = profile.tags.map(normalizeText);

      return normalizedName.includes(normalizedQuery) || normalizedTags.some((tag) => tag.includes(normalizedQuery));
    });
  }, [normalizedQuery]);

  const handleAddCelebrity = async (profile: CelebrityProfile) => {
    if (!faceCropModel) return;

    setLoading(true);

    try {
      const file = await fetchImageAsFile(profile.imageUrl, profile.id);
      const faceCoordinates = await detectFaces(file);
      const metadata = createImageMetadata(file, faceCoordinates);

      addImages([metadata]);

      if (!players.has(profile.name)) {
        addPlayer(profile.name, { id: profile.name, name: profile.name });
      }

      handleUpdatePlayer(metadata, profile.name);

      addToast({
        title: tAdd("PICTURE-SUCCESS"),
        description: tAdd("PICTURE-SUCCESS-DESC"),
        type: "success",
      });

      // 연예인 선택 후 faces 페이지로 이동
      router.push("/faces");
    } catch (error) {
      addToast({
        title: tAdd("PICTURE-FAIL"),
        description: t("SEARCH_ERROR", { name: profile.name }),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full mt-[6.25rem] px-4">
      <Input
        aria-label={t("SEARCH_PLACEHOLDER")}
        placeholder={t("SEARCH_PLACEHOLDER")}
        value={query}
        setValue={setQuery}
        className="pl-12"
        wrapperClassName="mb-6"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden width={18} height={18} />
      </Input>

      {filteredCelebrities.length === 0 ? (
        <p className="body-2 text-text-03">{t("SEARCH_EMPTY", { query })}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCelebrities.map((profile) => (
            <article
              key={profile.id}
              id={profile.id}
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
                <Button variant="primarySolid" disabled={!faceCropModel} onClick={() => handleAddCelebrity(profile)}>
                  {t("ADD_BUTTON")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CelebritySearchSection;
