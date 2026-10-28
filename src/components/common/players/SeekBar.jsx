// Thin progress bar with a hover thumb; an invisible range input handles seeking
function SeekBar({
  progress,
  currentTime,
  duration,
  onSeek,
  trackClassName = "bg-white/20",
  fillClassName = "bg-white group-hover:bg-[#1ed760]",
  thumbClassName = "bg-white",
}) {
  return (
    <div className="group relative flex h-4 flex-1 items-center">
      <div className={`h-1 w-full rounded-full ${trackClassName}`}>
        <div
          className={`h-full rounded-full ${fillClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className={`pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full opacity-0 shadow transition group-hover:opacity-100 ${thumbClassName}`}
        style={{ left: `${progress}%` }}
      />
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label="Seek"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

export default SeekBar;
