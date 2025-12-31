import { TrafficData } from "@/types/traffic";
import { parseISTTimestamp } from "@/utils/timeUtils";
import { calculateTotalTraffic } from "@/utils/trafficUtils";
import { MetricType, METRIC_CONFIG, CHART_COLORS } from "./ChartConfig";

export function processChartData(
  data: TrafficData[],
  selectedMetric: MetricType,
) {
  // Sort data by timestamp in ascending order (oldest first)
  const sortedData = [...data].sort((a, b) => {
    const dateA = parseISTTimestamp(a.ts);
    const dateB = parseISTTimestamp(b.ts);
    return dateA.getTime() - dateB.getTime();
  });

  return sortedData.map((point) => {
    const timestamp = parseISTTimestamp(point.ts);
    const total = calculateTotalTraffic(point);

    const baseData = {
      timestamp: timestamp, // Use actual Date object for uniform x-axis
      yellow: point.yellow,
      red: point.red,
      dark_red: point.dark_red,
      total,
      latest_severity: point.latest_severity || 0,
    };

    if (selectedMetric === "all") {
      return baseData;
    }

    return {
      timestamp: timestamp, // Use actual Date object for uniform x-axis
      [selectedMetric]: baseData[selectedMetric as keyof typeof baseData],
    };
  });
}

export function getChartLines(selectedMetric: MetricType) {
  if (selectedMetric === "all") {
    return [
      { dataKey: "yellow", stroke: CHART_COLORS.yellow, name: "Yellow" },
      { dataKey: "red", stroke: CHART_COLORS.red, name: "Red" },
      { dataKey: "dark_red", stroke: CHART_COLORS.dark_red, name: "Dark Red" },
      { dataKey: "total", stroke: CHART_COLORS.total, name: "Total" },
      {
        dataKey: "latest_severity",
        stroke: CHART_COLORS.latest_severity,
        name: "Latest Severity",
      },
    ];
  }

  const metric = METRIC_CONFIG.find((m) => m.value === selectedMetric);
  return [
    {
      dataKey: selectedMetric,
      stroke:
        CHART_COLORS[selectedMetric as keyof typeof CHART_COLORS] ||
        CHART_COLORS.total,
      name: metric?.label || selectedMetric,
    },
  ];
}
