"use client";

import { ImagePlus, Loader2, Sparkles } from "lucide-react";
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

type EmotionStyleLabel = keyof typeof EMOTION_STYLE;

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

const AnalyzingProgress = () => {
  const t = useTranslations("EMOTIONPAGE");

  return (
    <Motion
      componentType="div"
      className="w-full max-w-[29rem] rounded-2xl border border-line-01 bg-background-01 p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className="mb-3 flex items-center gap-2 body-2 text-text-02">
        <Loader2 className="animate-spin text-primary-01" size={18} />
        {t("analyzingButton")}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background-02">
        <Motion
          componentType="div"
          className="h-full w-1/3 rounded-full bg-primary-01"
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
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
  const lastAnalyzedFileRef = useRef<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EmotionPredictionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPredicting, setPredicting] = useState(false);
  const { faceApi, isLoading, isError, progress, loadModelWithProgress, predictEmotion } = useEmotionModelStore();

  const modelReady = !!faceApi && !isLoading;
  const dominantScore = useMemo(() => result?.scores.find((score) => score.label === result.dominantEmotion), [result]);

  useEffect(() => {
    loadModelWithProgress();
  }, [loadModelWithProgress]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  useEffect(() => {
    if (!file || !modelReady || isPredicting || lastAnalyzedFileRef.current === file) return;

    let isCancelled = false;

    const runPrediction = async () => {
      try {
        lastAnalyzedFileRef.current = file;
        setPredicting(true);
        setErrorMessage(null);
        setResult(null);
        const prediction = await predictEmotion(file);
        if (!isCancelled) setResult(prediction);
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof Error) {
            if (error.message === "EMOTION_MODEL_NOT_READY") setErrorMessage(t("errors.modelNotReady"));
            else if (error.message === "EMOTION_FACE_NOT_FOUND") setErrorMessage(t("errors.faceNotFound"));
            else if (error.message === "EMOTION_IMAGE_LOAD_FAILED") setErrorMessage(t("errors.imageLoadFailed"));
            else if (error.message === "EMOTION_MODEL_LOAD_FAILED") setErrorMessage(t("errors.modelLoadFailed"));
            else setErrorMessage(t("errors.predictionFailed"));
          } else {
            setErrorMessage(t("errors.predictionFailed"));
          }
        }
      } finally {
        if (!isCancelled) setPredicting(false);
      }
    };

    runPrediction();

    return () => {
      isCancelled = true;
    };
  }, [file, isPredicting, modelReady, predictEmotion, t]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (preview) URL.revokeObjectURL(preview);
    lastAnalyzedFileRef.current = null;
    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
    setResult(null);
    setErrorMessage(null);
    event.target.value = "";
  };

  const dominantEmotionStyle = result ? EMOTION_STYLE[result.dominantEmotion] : null;

  return (
    <section className="relative flex w-full flex-col items-center gap-5 px-4 pb-[140px] pt-6">
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
              <Image
                src={preview}
                alt={t("previewAlt")}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 29rem"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
              {isPredicting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-text-01 shadow-lg">
                    <Loader2 className="animate-spin text-primary-01" size={18} />
                    <span className="body-2">{t("analyzingButton")}</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/25 bg-black/30 px-4 py-3 text-white backdrop-blur-md">
                <span className="body-2 truncate">{file?.name}</span>
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
            <Motion componentType="div" className="h-full rounded-full bg-primary-01" initial={{ width: 0 }} animate={{ width: `${progress}%` }}>
              {null}
            </Motion>
          </div>
        </div>
      )}

      {isPredicting && <AnalyzingProgress />}
      {isError && <p className="body-2 text-error-01">{t("errors.modelLoadFailed")}</p>}
      {errorMessage && <p className="body-2 max-w-[29rem] rounded-2xl bg-error-01/10 px-4 py-3 text-center text-error-01">{errorMessage}</p>}

      {result && dominantScore && dominantEmotionStyle && (
        <Motion
          componentType="div"
          className="w-full max-w-[29rem] overflow-hidden rounded-[2rem] border border-white/50 bg-background-01 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.10)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="body-2 text-text-03">{t("dominantEmotion")}</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="display-1 text-text-01">{t(`emotions.${result.dominantEmotion}`)}</span>
                <span className="headline" style={{ color: dominantEmotionStyle.color }}>
                  {dominantScore.score}%
                </span>
              </div>
            </div>
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[1.35rem] font-bold"
              style={{ backgroundColor: `${dominantEmotionStyle.color}24`, color: dominantEmotionStyle.color }}
            >
              {dominantEmotionStyle.icon}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
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
          <Button className="w-full" variant="primarySolid" onClick={() => fileInputRef.current?.click()}>
            <span className="flex items-center justify-center gap-2">
              <ImagePlus size={19} />
              {t("choosePhoto")}
            </span>
          </Button>
        </Motion>
      </nav>
    </section>
  );
};

export default EmotionAnalyzer;

