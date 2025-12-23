import { TrafficGridCell } from "./TrafficGridCell";

export interface TrafficData {
  x: number;
  y: number;
  yellow: number;
  red: number;
  dark_red: number;
  ts: string;
}

interface TrafficGridProps {
  data: TrafficData[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function TrafficGrid({ data, isLoading, emptyMessage = "No data available" }: TrafficGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="traffic-grid-cell p-4 min-h-[140px] animate-pulse"
          >
            <div className="h-3 w-16 bg-muted rounded mb-4" />
            <div className="space-y-2">
              <div className="h-8 w-12 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-2 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {data.map((item, index) => (
        <div key={`${item.x}-${item.y}-${index}`} style={{ animationDelay: `${index * 50}ms` }}>
          <TrafficGridCell
            x={item.x}
            y={item.y}
            yellow={item.yellow}
            red={item.red}
            darkRed={item.dark_red}
            timestamp={item.ts}
          />
        </div>
      ))}
    </div>
  );
}
