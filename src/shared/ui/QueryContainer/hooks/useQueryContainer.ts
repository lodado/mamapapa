import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getParsedQuery } from "../utils";

export function useQueryContainer<RESPONSE, VARIABLE extends Record<string, unknown> = { "": undefined }>({
  queryKey,
  queryFn,
  initialData,
  variables,
  queryOptions = {} as UseQueryOptions<RESPONSE, unknown, RESPONSE, unknown[]>,
}: {
  queryKey: string | string[];
  queryFn: (variables: VARIABLE) => Promise<RESPONSE>;
  initialData?: RESPONSE;
  variables?: VARIABLE;
  queryOptions?: Omit<UseQueryOptions<RESPONSE, unknown, RESPONSE, any>, "queryKey" | "queryFn">;
}) {
  const parsedQueryKey = getParsedQuery({ queryKey, variables: variables! });

  const query = useQuery({
    retry: 1,
    queryFn: () => queryFn(variables!),
    initialData,
    ...queryOptions,
    queryKey: parsedQueryKey,
  });

  return { parsedQueryKey, query };
}
