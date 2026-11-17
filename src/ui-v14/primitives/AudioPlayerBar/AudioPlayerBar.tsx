import React from 'react';
import { AudioPlayerVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';

export interface AudioPlayerBarProps {
  audio: AudioPlayerVM;
  callbacks?: AudioPlayerCallbacks;
  onPlay?: (id: string) => void;
  onPause?: (id: string) => void;
  onSeek?: (id: string, seconds: number) => void;
  onVolumeChange?: (id: string, volume: number) => void;
  className?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  audio,
  callbacks,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  className = '',
}) => {
  const handlePlay = onPlay || callbacks?.onPlay;
  const handlePause = onPause || callbacks?.onPause;
  const handleSeek = onSeek || callbacks?.onSeek;
  const handleVolume = onVolumeChange || callbacks?.onVolumeChange;
  const isPlaying = audio.state === 'playing';
  const isAvailable = audio.state !== 'unavailable' && audio.state !== 'error';

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.floor(Math.max(0, totalSeconds) % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = audio.durationSeconds > 0
    ? Math.min(100, Math.max(0, (audio.currentSeconds / audio.durationSeconds) * 100))
    : 0;

  const handleTogglePlay = () => {
    if (!isAvailable) return;
    if (isPlaying) {
      if (audio.canPause && handlePause) handlePause(audio.id);
    } else {
      if (handlePlay) handlePlay(audio.id);
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAvailable || !handleSeek || audio.durationSeconds <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(audio.id, Math.round(ratio * audio.durationSeconds));
  };

  return (
    <div
      className={`v14-audio-player-bar ${className}`}
      role="region"
      aria-label="Thanh phát âm thanh bài nghe"
    >
      <button
        type="button"
        className="v14-audio-play-btn"
        disabled={!isAvailable}
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Tạm dừng âm thanh' : 'Phát âm thanh'}
        title={!isAvailable ? (audio.reason || 'Âm thanh chưa sẵn sàng') : undefined}
      >
        {audio.state === 'loading' ? '⏳' : isPlaying ? '❚❚' : '▶'}
      </button>

      <span className="v14-audio-time">
        {formatTime(audio.currentSeconds)}
      </span>

      <div
        className="v14-audio-scrubber-track"
        onClick={handleTrackClick}
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Thanh tua âm thanh"
      >
        <div
          className="v14-audio-scrubber-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <span className="v14-audio-time">
        {formatTime(audio.durationSeconds)}
      </span>

      <div className="v14-audio-vol-wrap">
        <span style={{ fontSize: '0.85rem' }} aria-hidden="true">
          {audio.volume === 0 ? '🔇' : '🔊'}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audio.volume}
          onChange={(e) => handleVolume && handleVolume(audio.id, parseFloat(e.target.value))}
          className="v14-audio-vol-slider"
          aria-label="Âm lượng bài nghe"
        />
      </div>
    </div>
  );
};
