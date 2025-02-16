"use client";

import { useTranslations } from "next-intl";
import React, { useLayoutEffect } from "react";

import { USER_PLAYER_NAME } from "../configs";
import { usePlayerStore } from "../models";

const HydratePlayerStore = () => {
  const t = useTranslations("PLAYERS");
  const { initPlayers } = usePlayerStore();

  useLayoutEffect(() => {
    initPlayers(
      new Map([
        [USER_PLAYER_NAME, t("Myself")],
        ["엄마", t("Mama")],
        ["아빠", t("Papa")],
      ])
    );
  }, []);

  return <></>;
};

export default HydratePlayerStore;
