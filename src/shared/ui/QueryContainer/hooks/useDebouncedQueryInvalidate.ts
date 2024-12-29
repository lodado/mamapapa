import { useDebounce } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";

const useDebouncedQueryInvalidate = ({ queryKey }: { queryKey: string }) => {
  const queryClient = useQueryClient();

  const debouncedQueryInvalidate = useDebounce(
    () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    500,
    [queryKey, queryClient]
  );

  return { debouncedQueryInvalidate };
};

export default useDebouncedQueryInvalidate;
