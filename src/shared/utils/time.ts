import dayjs from "dayjs";

export function timestampToTimeFormat(timestamp: Date): string {
  const date = dayjs(timestamp);
  const isPM = date.format("A") === "PM";
  const period = isPM ? "오후" : "오전";

  return `${date.format("YYYY-MM-DD")} ${period} ${date.format("hh:mm:ss")}`;
}
