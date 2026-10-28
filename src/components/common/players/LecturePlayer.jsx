import moment from "moment";
import { formatDuration } from "../../core/chapters/utils";
import Icon from "../Icon";
import SeekBar from "./SeekBar";
import { formatTime, useAudioPlayer } from "./useAudioPlayer";

// TODO: remove once lectures have their own cover image
export const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop";

// Spotify-style "now playing" card with a custom audio player
function LecturePlayer({ lecture, actions }) {
  const player = useAudioPlayer(lecture.duration || 0);

  const coverUrl =
    lecture.thumbnailUrl || lecture.imageUrl || PLACEHOLDER_COVER;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#121212] text-white shadow-xl">
      {/* Ambient backdrop from the cover */}
      <img
        src={coverUrl}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-3xl"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/80 to-[#121212]" />

      <div className="relative p-5 sm:p-8">
        {/* Hero */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] sm:mx-0 sm:h-52 sm:w-52">
            <img
              src={coverUrl}
              alt={lecture.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex justify-end">{actions}</div>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight break-words sm:text-5xl">
              {lecture.title}
            </h3>
            {lecture.description && (
              <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-white/70">
                {lecture.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-white/70">
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${lecture.isActive ? "text-[#1ed760]" : "text-white/50"}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${lecture.isActive ? "bg-[#1ed760]" : "bg-white/40"}`}
                />
                {lecture.isActive ? "Live" : "Hidden"}
              </span>
              <span>•</span>
              <span>{formatDuration(lecture.duration || player.duration)}</span>
              <span>•</span>
              <span>Updated {moment(lecture.updatedAt).fromNow()}</span>
            </div>
          </div>
        </div>

        {/* Player */}
        {lecture.audioUrl ? (
          <div className="mt-8">
            <audio src={lecture.audioUrl} {...player.audioProps} />

            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={player.cycleSpeed}
                title="Playback speed"
                className="w-12 cursor-pointer text-sm font-semibold text-white/70 transition hover:text-white"
              >
                {player.speed}x
              </button>
              <button
                type="button"
                onClick={() => player.skip(-15)}
                title="Back 15 seconds"
                className="cursor-pointer text-white/70 transition hover:text-white"
              >
                <Icon name="RotateCcw" size={24} />
              </button>
              <button
                type="button"
                onClick={player.togglePlay}
                title={player.isPlaying ? "Pause" : "Play"}
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition hover:scale-105 hover:bg-[#3be477] active:scale-95"
              >
                <Icon
                  name={player.isPlaying ? "Pause" : "Play"}
                  size={26}
                  fill="currentColor"
                  className={player.isPlaying ? "" : "ml-0.5"}
                />
              </button>
              <button
                type="button"
                onClick={() => player.skip(15)}
                title="Forward 15 seconds"
                className="cursor-pointer text-white/70 transition hover:text-white"
              >
                <Icon name="RotateCw" size={24} />
              </button>
              <button
                type="button"
                onClick={player.toggleMute}
                title={player.isMuted ? "Unmute" : "Mute"}
                className="flex w-12 cursor-pointer justify-center text-white/70 transition hover:text-white"
              >
                <Icon name={player.isMuted ? "VolumeX" : "Volume2"} size={22} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs text-white/60 tabular-nums">
              <span className="w-12 text-right">
                {formatTime(player.currentTime)}
              </span>
              <SeekBar
                progress={player.progress}
                currentTime={player.currentTime}
                duration={player.duration}
                onSeek={player.seek}
              />
              <span className="w-12">{formatTime(player.duration)}</span>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-white/50">
            No audio file attached
          </p>
        )}
      </div>
    </div>
  );
}

export default LecturePlayer;
