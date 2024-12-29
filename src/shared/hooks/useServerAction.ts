"use client";

import { useTransition } from "react";

import { SET_PAGE_LOADING } from "../models/pageLoadingSlice";
import useErrorBoundary from "./useErrorBoundary";
import { useDispatch } from "./reduxSelector";

const useServerAction = (action: (formData: FormData) => Promise<any | undefined>) => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const { setError } = useErrorBoundary();

  const onSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        dispatch(SET_PAGE_LOADING(true));
        await action(formData);
      } catch (e) {
        setError(e);
      } finally {
        dispatch(SET_PAGE_LOADING(false));
      }
    });
  };

  return { isPending, onSubmit };
};

export default useServerAction;
