"use client";

import { useTransition } from "react";
 
import useErrorBoundary from "./useErrorBoundary";

const useServerAction = (action: (formData: FormData) => Promise<any | undefined>, afterCallback?: () => void) => {
  let [isPending, startTransition] = useTransition();
  // const dispatch = useDispatch();
  const { setError } = useErrorBoundary();

  const onSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // dispatch(SET_PAGE_LOADING(true));
        await action(formData);
      } catch (e) {
        setError(e);
      } finally {
        // dispatch(SET_PAGE_LOADING(false));

        afterCallback?.();
      }
    });
  };

  return { isPending, onSubmit };
};

export default useServerAction;
