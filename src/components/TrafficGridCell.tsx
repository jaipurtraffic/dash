import { cn } from "@/lib/utils";

interface TrafficGridCellProps {
  x: number;
  y: number;
  yellow: number;
  red: number;
  darkRed: number;
  timestamp: string;
}

const getSeverityClass = (yellow: number, red: number, darkRed: number): string => {
  if (darkRed > 0) return "severity-dark-red";
  if (red > 0) return "severity-red";
  if (yellow > 0) return "severity-yellow";
  return "severity-green";
};

const getSeverityLabel = (yellow: number, red: number, darkRed: number): string => {
  if (darkRed > 0) return "Critical";
  if (red > 0) return "High";
  if (yellow > 0) return "Moderate";
  return "Normal";
};

const getSeverityColor = (yellow: number, red: number, darkRed: number): string => {
  if (darkRed > 0) return "text-traffic-dark-red";
  if (red > 0) return "text-traffic-red";
  if (yellow > 0) return "text-traffic-yellow";
  return "text-traffic-green";
};

export function TrafficGridCell({ x, y, yellow, red, darkRed, timestamp }: TrafficGridCellProps) {
  const severityClass = getSeverityClass(yellow, red, darkRed);
  const severityLabel = getSeverityLabel(yellow, red, darkRed);
  const severityColor = getSeverityColor(yellow, red, darkRed);
  const total = yellow + red + darkRed;

  return (
    <div
      className={cn(
        "traffic-grid-cell p-4 min-h-[140px] flex flex-col justify-between glow-effect animate-fade-in",
        severityClass
      )}
    >
      <div className="flex items-start justify-between">
        <div className="font-mono text-xs text-muted-foreground">
          Grid [{x}, {y}]
        </div>
        <span className={cn("text-xs font-medium", severityColor)}>
          {severityLabel}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>

        <div className="flex gap-3 text-xs font-mono">
          {yellow > 0 && (
            <span className="text-traffic-yellow">Y:{yellow}</span>
          )}
          {red > 0 && (
            <span className="text-traffic-red">R:{red}</span>
          )}
          {darkRed > 0 && (
            <span className="text-traffic-dark-red">DR:{darkRed}</span>
          )}
        </div>

        <div className="text-[10px] text-muted-foreground font-mono truncate">
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
