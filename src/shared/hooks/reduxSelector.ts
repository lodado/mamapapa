"use client";

import {
  useDispatch as _useDisPatch,
  useSelector as _useSelector,
  createDispatchHook,
  createSelectorHook,
  UseDispatch,
  UseSelector,
} from "react-redux";

import { Dispatch, RootState } from "../interfaces";
import { GlobalReduxContext } from "@/app/provider/ReduxInitStoreProvider";

export const useDispatch = createDispatchHook(GlobalReduxContext) as UseDispatch<Dispatch>;
export const useSelector = createSelectorHook(GlobalReduxContext) as UseSelector<RootState>;

