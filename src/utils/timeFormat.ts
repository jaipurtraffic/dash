/**
 * Consistent time formatting utilities for the entire application
 */

export type TimeFormatOptions = {
  includeSeconds?: boolean;
  includeTimeZone?: boolean;
  use12Hour?: boolean;
  compact?: boolean;
};

/**
 * Standard time format used throughout the application
 * Format: "DD-MMM-YYYY HH:MM:SS IST" (e.g., "31-Dec-2025 21:41:30 IST")
 */
export function formatStandardTime(
  date: Date,
  options: TimeFormatOptions = {}
): string {
  const {
    includeSeconds = true,
    includeTimeZone = true,
    use12Hour = false,
    compact = false,
  } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: compact ? "2-digit" : "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: use12Hour,
    timeZone: "Asia/Kolkata",
  };

  if (includeSeconds) {
    formatOptions.second = "2-digit";
  }

  let formatted = date.toLocaleString("en-IN", formatOptions);

  // Replace slashes with dashes for consistency
  formatted = formatted.replace(/\//g, '-');

  // Add timezone if requested and not already included
  if (includeTimeZone && !formatted.includes("IST")) {
    formatted += " IST";
  }

  return formatted;
}

/**
 * Compact time format for UI elements with limited space
 * Format: "DD-MMM-YYYY HH:MM" (e.g., "31-Dec-2025 21:41")
 */
export function formatCompactTime(date: Date): string {
  return formatStandardTime(date, {
    includeSeconds: false,
    includeTimeZone: false,
    compact: true,
  });
}

/**
 * Time format for tooltips and detailed views
 * Format: "DD-MMM-YYYY HH:MM:SS IST" (full format)
 */
export function formatDetailedTime(date: Date): string {
  return formatStandardTime(date, {
    includeSeconds: true,
    includeTimeZone: true,
  });
}

/**
 * Time format for data ranges and summaries
 * Format: "DD-MMM-YYYY HH:MM" (consistent, no timezone)
 */
export function formatRangeTime(date: Date): string {
  return formatStandardTime(date, {
    includeSeconds: false,
    includeTimeZone: false,
  });
}

/**
 * Time format for chart x-axis
 * Format: "DD/MM HH:MM" (e.g., "31/12 23:23")
 */
export function formatChartTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month} ${hours}:${minutes}`;
}
