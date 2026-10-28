import { createPortal } from "react-dom";
import Icon from "../Icon";
import { PLACEHOLDER_COVER } from "./LecturePlayer";
import SeekBar from "./SeekBar";
import { formatTime } from "./useAudioPlayer";

const iconButtonClass =
  "cursor-pointer rounded-full p-1.5 text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

// Spotify-style bar pinned to the bottom of the scroll area.
// `player` comes from useAudioPlayer so the list can drive playback too.
function NowPlayingBar({ track, player, onPrev, onNext, onClose }) {
  if (!track) return null;

  const coverUrl = track.imageUrl || track.thumbnailUrl || PLACEHOLDER_COVER;

  const bar = (
    <div className="container mx-auto px-4 pb-4">
      <div className="bg-secondary text-onSecondary grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl p-3 shadow-[0_-4px_30px_rgba(0,0,0,0.25)] md:grid-cols-[1fr_minmax(0,2fr)_1fr]">
        {/* Track info */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={coverUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-md object-cover shadow"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{track.title}</p>
            {track.description && (
              <p className="truncate text-xs text-white/60">
                {track.description}
              </p>
            )}
          </div>
        </div>

        {/* Transport + seek */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => player.skip(-15)}
              title="Back 15 seconds"
              className={`${iconButtonClass} hidden sm:block`}
            >
              <Icon name="RotateCcw" size={16} />
            </button>
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              title="Previous"
              className={iconButtonClass}
            >
              <Icon name="SkipBack" size={18} fill="currentColor" />
            </button>
            <button
              type="button"
              onClick={player.togglePlay}
              title={player.isPlaying ? "Pause" : "Play"}
              className="text-secondary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white transition hover:scale-105 active:scale-95"
            >
              <Icon
                name={player.isPlaying ? "Pause" : "Play"}
                size={16}
                fill="currentColor"
                className={player.isPlaying ? "" : "ml-0.5"}
              />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              title="Next"
              className={iconButtonClass}
            >
              <Icon name="SkipForward" size={18} fill="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => player.skip(15)}
              title="Forward 15 seconds"
              className={`${iconButtonClass} hidden sm:block`}
            >
              <Icon name="RotateCw" size={16} />
            </button>
          </div>
          <div className="hidden w-full items-center gap-2 text-[11px] text-white/60 tabular-nums md:flex">
            <span className="w-10 text-right">
              {formatTime(player.currentTime)}
            </span>
            <SeekBar
              progress={player.progress}
              currentTime={player.currentTime}
              duration={player.duration}
              onSeek={player.seek}
              fillClassName="bg-white group-hover:bg-primary"
            />
            <span className="w-10">{formatTime(player.duration)}</span>
          </div>
        </div>

        {/* Extras */}
        <div className="hidden items-center justify-end gap-1 md:flex">
          <button
            type="button"
            onClick={player.cycleSpeed}
            title="Playback speed"
            className="w-10 cursor-pointer text-xs font-semibold text-white/70 transition hover:text-white"
          >
            {player.speed}x
          </button>
          <button
            type="button"
            onClick={player.toggleMute}
            title={player.isMuted ? "Unmute" : "Mute"}
            className={iconButtonClass}
          >
            <Icon name={player.isMuted ? "VolumeX" : "Volume2"} size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close player"
            className={iconButtonClass}
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  // Rendered into the layout's bottom slot so it stays at the bottom of the
  // content area even when the page is too short to scroll
  const slot = document.getElementById("bottom-bar-slot");
  return slot ? createPortal(bar, slot) : bar;
}

export default NowPlayingBar;
