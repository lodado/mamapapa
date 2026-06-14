"use client";

import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/ui";
import { Motion } from "@/shared/ui/animation/animation";

import { EmotionPredictionResult, useEmotionModelStore } from "../model";

const EMOTION_STYLE = {
  neutral: { icon: "○", color: "#8B95A1", glow: "rgba(139,149,161,0.32)" },
  happy: { icon: "☺", color: "#FFC83D", glow: "rgba(255,200,61,0.36)" },
  sad: { icon: "☔", color: "#6CA8FF", glow: "rgba(108,168,255,0.34)" },
  angry: { icon: "!", color: "#FF6B6B", glow: "rgba(255,107,107,0.34)" },
  fearful: { icon: "△", color: "#9B7BFF", glow: "rgba(155,123,255,0.34)" },
  disgusted: { icon: "×", color: "#63D297", glow: "rgba(99,210,151,0.34)" },
  surprised: { icon: "✦", color: "#FF9F43", glow: "rgba(255,159,67,0.34)" },
} as const;

const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type EmotionStyleLabel = keyof typeof EMOTION_STYLE;
type EmotionTranslator = ReturnType<typeof useTranslations<"EMOTIONPAGE">>;

const getLocalizedErrorMessage = (message: string, t: EmotionTranslator) => {
  if (message === "EMOTION_MODEL_NOT_READY") return t("errors.modelNotReady");
  if (message === "EMOTION_FACE_NOT_FOUND") return t("errors.faceNotFound");
  if (message === "EMOTION_IMAGE_LOAD_FAILED") return t("errors.imageLoadFailed");
  if (message === "EMOTION_MODEL_LOAD_FAILED") return t("errors.modelLoadFailed");
  return t("errors.predictionFailed");
};

const EmotionScoreRing = ({ label, score }: { label: EmotionStyleLabel; score: number }) => {
  const t = useTranslations("EMOTIONPAGE");
  const emotion = EMOTION_STYLE[label];
  const dashOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * score) / 100;

  return (
    <div className="relative mx-auto mt-2 flex h-[190px] w-[190px] items-center justify-center">
      <Motion
        componentType="div"
        className="absolute h-[132px] w-[132px] rounded-full blur-2xl"
        style={{ backgroundColor: emotion.glow }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {null}
      </Motion>

      <svg className="absolute inset-0 -rotate-90 drop-shadow-sm" viewBox="0 0 190 190" aria-hidden="true">
        <circle cx="95" cy="95" r={RING_RADIUS} fill="none" stroke="rgba(139,149,161,0.14)" strokeWidth="15" />
        <motion.circle
          cx="95"
          cy="95"
          r={RING_RADIUS}
          fill="none"
          stroke={emotion.color}
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <Motion
        componentType="div"
        className="relative flex h-[126px] w-[126px] flex-col items-center justify-center rounded-full border border-white/40 bg-background-01/90 text-center shadow-[0_18px_50px_rgba(0,0,0,0.10)] backdrop-blur"
        initial={{ opacity: 0, y: 10, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, delay: 0.14 }}
      >
        <span className="text-[2.25rem] leading-none" style={{ color: emotion.color }}>
          {emotion.icon}
        </span>
        <span className="body-2 mt-1 text-text-03">{t(`emotions.${label}`)}</span>
        <span className="display-1 text-text-01">{score}%</span>
      </Motion>
    </div>
  );
};

const EmotionScoreBar = ({ label, score, index }: { label: EmotionStyleLabel; score: number; index: number }) => {
  const t = useTranslations("EMOTIONPAGE");
  const emotion = EMOTION_STYLE[label];

  return (
    <Motion
      componentType="div"
      className="rounded-2xl border border-line-01 bg-background-02/70 p-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.07 * index }}
    >
      <div className="mb-2 flex justify-between body-2 text-text-02">
        <span className="flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold"
            style={{ backgroundColor: `${emotion.color}24`, color: emotion.color }}
          >
            {emotion.icon}
          </span>
          {t(`emotions.${label}`)}
        </span>
        <span className="font-semibold text-text-01">{score}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-background-01">
        <Motion
          componentType="div"
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${emotion.color}99, ${emotion.color})`,
            boxShadow: `0 0 18px ${emotion.glow}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.72, delay: 0.16 + 0.07 * index, ease: "easeOut" }}
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
  const modelReady = !!faceApi && !isLoading;

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
    <section className="relative flex w-full flex-col items-center gap-5 px-4 pb-[180px] pt-6">
      <Motion
        componentType="div"
        className="pointer-events-none absolute left-6 top-0 h-28 w-28 rounded-full bg-primary-01/15 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {null}
      </Motion>

      <Motion
        componentType="div"
        className="w-full max-w-[29rem] overflow-hidden rounded-[2rem] border border-white/50 bg-background-01 shadow-[0_24px_70px_rgba(0,0,0,0.10)]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <button
          type="button"
          className="group relative flex aspect-[4/4.35] w-full items-center justify-center overflow-hidden bg-background-02 text-left"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <>
              <Image src={preview} alt={t("previewAlt")} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 29rem" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/25 bg-black/30 px-4 py-3 text-white backdrop-blur-md">
                <span className="body-2 line-clamp-1">{file?.name}</span>
                <ImagePlus size={20} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 px-8 text-center">
              <Motion
                componentType="div"
                className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary-01 text-text-00 shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ImagePlus size={34} />
              </Motion>
              <div>
                <p className="headline text-text-01">{t("addPhotoTitle")}</p>
                <p className="body-2 mt-2 text-text-03">{t("addPhotoDescription")}</p>
              </div>
            </div>
          )}
        </button>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="px-4 pb-4 pt-3">
          <p className="body-2 text-center text-text-03">{file ? file.name : t("addPhotoDescription")}</p>
        </div>
      </Motion>

      {(isLoading || !faceApi) && (
        <div className="w-full max-w-[29rem] rounded-2xl border border-line-01 bg-background-01 p-4">
          <div className="mb-2 flex items-center justify-between body-2 text-text-03">
            <span>{t("preparingModel")}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background-02">
            <Motion
              componentType="div"
              className="h-full rounded-full bg-primary-01"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            >
              {null}
            </Motion>
          </div>
        </div>
      )}

      {isError && <p className="body-2 text-error-01">{t("errors.modelLoadFailed")}</p>}
      {errorMessage && <p className="body-2 max-w-[29rem] rounded-2xl bg-error-01/10 px-4 py-3 text-center text-error-01">{errorMessage}</p>}

      {result && dominantScore && (
        <Motion
          componentType="div"
          className="w-full max-w-[29rem] overflow-hidden rounded-[2rem] border border-white/50 bg-background-01 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.10)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <p className="body-2 text-text-03">{t("dominantEmotion")}</p>
            <span className="rounded-full bg-primary-01/10 px-3 py-1 caption-1 text-primary-01">AI</span>
          </div>

          <EmotionScoreRing label={result.dominantEmotion} score={dominantScore.score} />

          <div className="mt-3 flex flex-col gap-2.5">
            {result.scores.map((score, index) => (
              <EmotionScoreBar key={score.label} label={score.label} score={score.score} index={index} />
            ))}
          </div>
        </Motion>
      )}

      <nav
        className={`z-nav fixed bottom-0 flex w-full flex-col gap-3 bg-background-op-01 px-6 pt-6 md:w-[768px]
          pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
      >
        <Motion componentType="div" whileTap={{ scale: 0.985 }}>
          <Button className="w-full" variant="primaryLine" onClick={() => fileInputRef.current?.click()}>
            <span className="flex items-center justify-center gap-2">
              <ImagePlus size={19} />
              {t("choosePhoto")}
            </span>
          </Button>
        </Motion>

        <Motion componentType="div" whileTap={modelReady && !isPredicting ? { scale: 0.985 } : undefined}>
          <Button className="w-full" variant="primarySolid" disabled={!modelReady || isPredicting} onClick={handleAnalyze}>
            <span className="flex items-center justify-center gap-2">
              {isPredicting ? <Loader2 className="animate-spin" size={19} /> : <Sparkles size={19} />}
              {isPredicting ? t("analyzingButton") : t("analyzeButton")}
            </span>
          </Button>
        </Motion>
      </nav>
    </section>
  );
};

export default EmotionAnalyzer;
