import { UseQueryOptions } from "@tanstack/react-query";

import { cloneWithPropsIfAbsent } from "@/shared/utils";

import { useQueryContainer } from "../hooks";

export default function QueryContainer<RESPONSE, VARIABLE extends Record<string, unknown>>({
  children,
  queryKey,
  queryFn,
  variables,
  queryOptions = {} as UseQueryOptions<RESPONSE, unknown, RESPONSE, unknown[]>,
  loadingComponent = <></>,
  errorComponent = <></>,
}: {
  children: JSX.Element;
  queryKey: string | string[];
  queryFn: (variables: VARIABLE) => Promise<RESPONSE>;
  queryOptions?: Omit<UseQueryOptions<RESPONSE, unknown, RESPONSE, any>, "queryKey" | "queryFn">;
  variables?: VARIABLE;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
}) {
  const { query, parsedQueryKey } = useQueryContainer({
    queryKey,
    queryFn,
    variables,
    queryOptions,
  });

  const response = query?.isError ? undefined : query?.data;

  return (
    <div style={{ position: "relative" }}>
      {cloneWithPropsIfAbsent(children, { response, queryKey: parsedQueryKey })}
      {query.status === "pending" && cloneWithPropsIfAbsent(loadingComponent, { queryKey: parsedQueryKey })}
      {query.status === "error" && cloneWithPropsIfAbsent(errorComponent, { queryKey: parsedQueryKey })}
    </div>
  );
}
