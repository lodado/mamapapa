/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { debounce } from "lodash-es";

import { useToastStore } from "../ui/Toast/stores";

type MutationWithNotificationProps<TData, TError, TVariables, TContext> = UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> & {
  onSuccessMessage?: string;
  onErrorMessage?: string;
};

const useMutationWithNotification = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options?: MutationWithNotificationProps<TData, TError, TVariables, TContext>,
  onErrorMessage?: {
    title: string;
    description?: string;
  }
) => {
  const { addToast } = useToastStore();

  const mutate = useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context);
      }

      addToast({
        type: "error",
        title: onErrorMessage?.title || "error",
        // @ts-ignore
        description: onErrorMessage?.description || error?.message || "An error occurred",
      });
    },
  });

  return {
    ...mutate,
    mutate: debounce(mutate.mutate, 300),
  };
};

export default useMutationWithNotification;
