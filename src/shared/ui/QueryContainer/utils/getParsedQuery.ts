export const getParsedQuery = <VARIABLE extends Record<string, unknown>>({
  queryKey,
  variables,
}: {
  queryKey: string | string[];
  variables: VARIABLE;
}) => {
  const parsedQueryKey = [queryKey, ...Object.entries(variables ?? {}).flatMap(([key, value]) => [key, value])];
  return parsedQueryKey;
};
