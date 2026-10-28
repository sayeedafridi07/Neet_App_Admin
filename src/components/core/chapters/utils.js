import moment from "moment";

// Seconds → "m:ss" (or "h:mm:ss" for long lectures)
export const formatDuration = (seconds) => {
  if (seconds == null) return "-";
  const d = moment.duration(seconds, "seconds");
  const mm = String(d.minutes()).padStart(2, "0");
  const ss = String(d.seconds()).padStart(2, "0");
  return d.hours() ? `${d.hours()}:${mm}:${ss}` : `${d.minutes()}:${ss}`;
};
