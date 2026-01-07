export const TRAFFIC_SEVERITY_COLORS = {
  critical:
    "bg-traffic-dark-red/20 border-traffic-dark-red/50 text-traffic-dark-red",
  high: "bg-traffic-red/20 border-traffic-red/50 text-traffic-red",
  medium: "bg-traffic-yellow/20 border-traffic-yellow/50 text-traffic-yellow",
} as const;

export const SEVERITY_LEVEL_COLORS = {
  high: "bg-red-600/20 border-red-600/50 text-red-600",
  moderate: "bg-yellow-600/20 border-yellow-600/50 text-yellow-600",
  normal: "bg-muted/20 border-border/50 text-muted-foreground",
} as const;

export const GRID_DIMENSIONS = {
  ROWS: 24,
  COLS: 16,
  ROW_HEIGHT: 53.3,
  ASPECT_RATIO: 12750 / 10920,
} as const;

const API_BASE = "https://traffic-worker.mangalaman93.workers.dev";

export const API_ENDPOINTS = {
  CURRENT: `${API_BASE}/current`,
  SUSTAINED: `${API_BASE}/sustained`,
  HISTORY: `${API_BASE}/history`,
} as const;

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/d/edit?mid=1AW5K34KiZmKo32vtBsmOnzNSU45oQS4";

export const TIMEZONE = "Asia/Kolkata" as const;
