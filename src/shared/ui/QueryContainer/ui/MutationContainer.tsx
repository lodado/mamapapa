import { MutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { cloneWithPropsIfAbsent } from "@/shared";

export default function MutationContainer<VARIABLE, RESPONSE>({
  children,
  mutationFn,
  loadingComponent = <></>,
  errorComponent = <></>,
  mutationOptions = {},
  invalidateQueryKeys = [],
}: {
  children: JSX.Element;
  mutationFn: (variables: VARIABLE) => Promise<RESPONSE>;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  invalidateQueryKeys?: string[];
  mutationOptions?: Omit<MutationOptions<RESPONSE, unknown, VARIABLE, unknown>, "mutationFn">;
}) {
  const queryClient = useQueryClient();
  const parsedQueryKey = invalidateQueryKeys;

  const mutation = useMutation({
    mutationFn: (params: VARIABLE) => mutationFn(params),
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      if (invalidateQueryKeys.length > 0) {
        queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });
      }

      mutationOptions?.onSuccess?.(data, variables, context);
    },
  });

  const action = (requestParams: VARIABLE) => {
    mutation.mutate(requestParams);
  };

  const response = mutation.data;

  return (
    <>
      {cloneWithPropsIfAbsent(children, { response: response, action, queryKey: parsedQueryKey })}
      {mutation.status === "pending" && cloneWithPropsIfAbsent(loadingComponent, { queryKey: parsedQueryKey })}
      {mutation.status === "error" && cloneWithPropsIfAbsent(errorComponent, { queryKey: parsedQueryKey })}
    </>
  );
}
