interface SkeletonCardProps {
  index: number;
}

export const SkeletonCard = ({ index }: SkeletonCardProps) => {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-border-02 bg-background-02 p-4 shadow-sm"
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-background-01">
        <div
          className="w-full h-full bg-gray-300 rounded-lg animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "1.5s",
          }}
        ></div>
      </div>
      <div className="flex flex-col gap-2">
        <div
          className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"
          style={{
            animationDelay: `${index * 0.1 + 0.2}s`,
            animationDuration: "1.5s",
          }}
        ></div>
        <div className="flex flex-wrap gap-2">
          <div
            className="h-6 bg-gray-300 rounded-full w-16 animate-pulse"
            style={{
              animationDelay: `${index * 0.1 + 0.4}s`,
              animationDuration: "1.5s",
            }}
          ></div>
          <div
            className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"
            style={{
              animationDelay: `${index * 0.1 + 0.6}s`,
              animationDuration: "1.5s",
            }}
          ></div>
          <div
            className="h-6 bg-gray-300 rounded-full w-14 animate-pulse"
            style={{
              animationDelay: `${index * 0.1 + 0.8}s`,
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div
          className="h-10 bg-gray-300 rounded w-full animate-pulse"
          style={{
            animationDelay: `${index * 0.1 + 1}s`,
            animationDuration: "1.5s",
          }}
        ></div>
      </div>
    </div>
  );
};
