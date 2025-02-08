export const getParsedHistoryListKey = ({ userId }: { userId: string }) => {
  return ["historyList", userId];
};
