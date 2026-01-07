export function parseISTTimestamp(timestamp: string | null): Date {
  if (!timestamp) return new Date();

  try {
    let date: Date;

    // Handle different timestamp formats
    if (timestamp.includes("T")) {
      // ISO format: 2025-12-31T16:11:30.000Z or similar
      // All timestamps from API should be treated as IST, even if they have Z suffix
      if (timestamp.endsWith("Z")) {
        // Remove Z suffix and parse as IST (local time)
        const timestampWithoutZ = timestamp.slice(0, -1);
        date = new Date(timestampWithoutZ);
      } else {
        // Parse as is, but ensure it's treated as IST
        date = new Date(timestamp);
      }
    } else {
      // Custom format: 2025-12-31 21:41:30
      date = new Date(timestamp.replace(" ", "T"));
    }

    // Ensure the parsed date is treated as IST
    // If the date was parsed as UTC, convert it to IST equivalent
    if (timestamp.endsWith("Z") || timestamp.includes("T")) {
      // The date object was created from what should be IST time
      // JavaScript Date constructor treats ISO strings without Z as local time
      // and with Z as UTC. Since we want IST, we need to adjust if it was parsed as UTC
      if (timestamp.endsWith("Z")) {
        // We already removed Z, so it's parsed as local time (IST) - good
        return date;
      } else {
        // Check if it might be UTC format - if so, convert to IST
        // IST is UTC+5:30, so subtract 5.5 hours from UTC to get IST
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        date = new Date(date.getTime() - istOffset);
        return date;
      }
    }

    return date;
  } catch (error) {
    console.warn("Invalid timestamp format:", timestamp);
    return new Date();
  }
}

export function getHoursAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMinutes === 0) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  if (diffInHours < 24) {
    const remainingMinutes = diffInMinutes % 60;
    if (remainingMinutes === 0)
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    return `${diffInHours}h ${remainingMinutes}m ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}
