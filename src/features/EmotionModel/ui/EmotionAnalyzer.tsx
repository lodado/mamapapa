"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Motion } from "@/shared/ui/animation/animation";

import { EmotionPredictionResult, useEmotionModelStore } from "../model";

const EMOTION_STYLE = {
  neutral: { icon: "○", color: "#8B95A1" },
  happy: { icon: "☺", color: "#FFC83D" },
  sad: { icon: "☔", color: "#6CA8FF" },
  angry: { icon: "!", color: "#FF6B6B" },
  fearful: { icon: "△", color: "#9B7BFF" },
  disgusted: { icon: "×", color: "#63D297" },
  surprised: { icon: "✦", color: "#FF9F43" },
} as const;

const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type EmotionStyleLabel = keyof typeof EMOTION_STYLE;

const getLocalizedErrorMessage = (message: string, t: ReturnType<typeof useTranslations<"EMOTIONPAGE">>) => {
  if (message === "EMOTION_MODEL_NOT_READY") return t("errors.modelNotReady");
  if (message === "EMOTION_FACE_NOT_FOUND") return t("errors.faceNotFound");
  if (message === "EMOTION_IMAGE_LOAD_FAILED") return t("errors.imageLoadFailed");
  if (message === "EMOTION_MODEL_LOAD_FAILED") return t("errors.modelLoadFailed");
  return t("errors.predictionFailed");
};

const EmotionScoreRing = ({
  label,
  score,
}: {
  label: EmotionStyleLabel;
  score: number;
}) => {
  const t = useTranslations("EMOTIONPAGE");
  const dashOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * score) / 100;
  const emotion = EMOTION_STYLE[label];

  return (
    <div className="relative mx-auto flex h-[172px] w-[172px] items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={RING_RADIUS} fill="none" stroke="rgba(139,149,161,0.18)" strokeWidth="14" />
        <motion.circle
          cx="80"
          cy="80"
          r={RING_RADIUS}
          fill="none"
          stroke={emotion.color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>

      <Motion
        componentType="div"
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <span className="text-[2rem]" style={{ color: emotion.color }}>
          {emotion.icon}
        </span>
        <span className="headline text-text-01">{t(`emotions.${label}`)}</span>
        <span className="display-1 text-text-01">{score}%</span>
      </Motion>
    </div>
  );
};

const EmotionScoreBar = ({
  label,
  score,
  index,
}: {
  label: EmotionStyleLabel;
  score: number;
  index: number;
}) => {
  const t = useTranslations("EMOTIONPAGE");
  const emotion = EMOTION_STYLE[label];

  return (
    <Motion
      componentType="div"
      className="flex flex-col gap-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.08 * index }}
    >
      <div className="flex justify-between body-2 text-text-02">
        <span className="flex items-center gap-2">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem]"
            style={{ backgroundColor: `${emotion.color}22`, color: emotion.color }}
          >
            {emotion.icon}
          </span>
          {t(`emotions.${label}`)}
        </span>
        <span>{score}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-background-02">
        <Motion
          componentType="div"
          className="h-full rounded-full"
          style={{ backgroundColor: emotion.color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.65, delay: 0.12 + 0.08 * index, ease: "easeOut" }}
        >
          {null}
        </Motion>
      </div>
    </Motion>
  );
};

const EmotionAnalyzer = () => {
  const t = useTranslations("EMOTIONPAGE");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EmotionPredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPredicting, setPredicting] = useState(false);
  const { faceApi, isLoading, isError, progress, loadModelWithProgress, predictEmotion } = useEmotionModelStore();

  useEffect(() => {
    loadModelWithProgress();
  }, [loadModelWithProgress]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const dominantScore = useMemo(() => result?.scores.find((score) => score.label === result.dominantEmotion), [result]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
    setResult(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setErrorMessage(t("errors.choosePhotoFirst"));
      return;
    }

    try {
      setPredicting(true);
      setErrorMessage(null);
      setResult(await predictEmotion(file));
    } catch (error) {
      setErrorMessage(error instanceof Error ? getLocalizedErrorMessage(error.message, t) : t("errors.predictionFailed"));
    } finally {
      setPredicting(false);
    }
  };

  return (
    <section className="flex w-full flex-col items-center gap-5 px-4 pb-[160px] pt-6">
      <div className="w-full max-w-[29rem] rounded-3xl border border-line-01 bg-background-01 p-4 shadow-sm">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-background-02">
          {preview ? (
            <Image src={preview} alt={t("previewAlt")} fill className="object-cover" sizes="(max-width: 768px) 100vw, 29rem" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-text-03">
              <span className="headline">{t("addPhotoTitle")}</span>
              <span className="body-2">{t("addPhotoDescription")}</span>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="mt-4 flex flex-col gap-3">
          <button className="h-14 rounded-2xl border border-primary-01 text-primary-01" onClick={() => fileInputRef.current?.click()}>
            {t("choosePhoto")}
          </button>
          <button
            className="h-14 rounded-2xl bg-primary-01 text-text-00 disabled:opacity-40"
            disabled={!faceApi || isLoading || isPredicting}
            onClick={handleAnalyze}
          >
            {isPredicting ? t("analyzingButton") : t("analyzeButton")}
          </button>
        </div>
      </div>

      {(isLoading || !faceApi) && (
        <p className="body-2 text-text-03">
          {t("preparingModel")} {progress}%
        </p>
      )}

      {isError && <p className="body-2 text-error-01">{t("errors.modelLoadFailed")}</p>}
      {errorMessage && <p className="body-2 max-w-[29rem] text-center text-error-01">{errorMessage}</p>}

      {result && dominantScore && (
        <Motion
          componentType="div"
          className="w-full max-w-[29rem] rounded-3xl bg-background-01 p-5 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="body-2 text-text-03">{t("dominantEmotion")}</p>

          <EmotionScoreRing label={result.dominantEmotion} score={dominantScore.score} />

          <div className="mt-5 flex flex-col gap-3">
            {result.scores.map((score, index) => (
              <EmotionScoreBar key={score.label} label={score.label} score={score.score} index={index} />
            ))}
          </div>
        </Motion>
      )}
    </section>
  );
};

export default EmotionAnalyzer;

