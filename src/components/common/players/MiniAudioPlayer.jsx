import Icon from "../Icon";
import SeekBar from "./SeekBar";
import { formatTime, useAudioPlayer } from "./useAudioPlayer";

const controlClass =
  "cursor-pointer rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white";

// Compact player for previews (e.g. inside forms)
function MiniAudioPlayer({ src, title, subtitle, onRemove }) {
  const player = useAudioPlayer();

  return (
    <div className="bg-primary text-onPrimary rounded-2xl p-4 shadow-md">
      <audio src={src} {...player.audioProps} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-white/70">{subtitle}</p>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove audio"
            className={controlClass}
          >
            <Icon name="Trash2" size={16} />
          </button>
        )}
      </div>

      {/* Seek */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-white/70 tabular-nums">
        <span className="w-10 text-right">
          {formatTime(player.currentTime)}
        </span>
        <SeekBar
          progress={player.progress}
          currentTime={player.currentTime}
          duration={player.duration}
          onSeek={player.seek}
          trackClassName="bg-white/25"
          fillClassName="bg-white"
        />
        <span className="w-10">{formatTime(player.duration)}</span>
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={player.cycleSpeed}
          title="Playback speed"
          className="w-10 cursor-pointer text-xs font-semibold text-white/80 transition hover:text-white"
        >
          {player.speed}x
        </button>
        <button
          type="button"
          onClick={() => player.skip(-15)}
          title="Back 15 seconds"
          className={controlClass}
        >
          <Icon name="RotateCcw" size={18} />
        </button>
        <button
          type="button"
          onClick={player.togglePlay}
          title={player.isPlaying ? "Pause" : "Play"}
          className="text-primary flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow transition hover:scale-105 hover:bg-white active:scale-95"
        >
          <Icon
            name={player.isPlaying ? "Pause" : "Play"}
            size={20}
            fill="currentColor"
            className={player.isPlaying ? "" : "ml-0.5"}
          />
        </button>
        <button
          type="button"
          onClick={() => player.skip(15)}
          title="Forward 15 seconds"
          className={controlClass}
        >
          <Icon name="RotateCw" size={18} />
        </button>
        <button
          type="button"
          onClick={player.toggleMute}
          title={player.isMuted ? "Unmute" : "Mute"}
          className={`${controlClass} flex w-10 justify-center`}
        >
          <Icon name={player.isMuted ? "VolumeX" : "Volume2"} size={18} />
        </button>
      </div>
    </div>
  );
}

export default MiniAudioPlayer;
