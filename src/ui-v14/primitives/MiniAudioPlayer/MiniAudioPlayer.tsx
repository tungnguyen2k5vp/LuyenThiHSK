import React from 'react';
import { AudioPlayerVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';

export interface MiniAudioPlayerProps {
  audio: AudioPlayerVM;
  callbacks?: AudioPlayerCallbacks;
  onPlay?: (id: string) => void;
  onPause?: (id: string) => void;
  onSeek?: (id: string, seconds: number) => void;
  onVolumeChange?: (id: string, volume: number) => void;
  className?: string;
}

export const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({
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
      className={`v14-mini-audio-player ${className}`}
      role="region"
      aria-label="Phát âm thanh câu hỏi nhỏ"
    >
      <button
        type="button"
        className="v14-mini-audio-btn"
        disabled={!isAvailable}
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Dừng phát' : 'Nghe audio'}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>

      {/* Mini Scrubber */}
      <div
        style={{
          width: '120px',
          height: '4px',
          backgroundColor: 'var(--v14-color-border)',
          borderRadius: '9999px',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={handleTrackClick}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--v14-color-primary)',
          }}
        />
      </div>

      {/* Volume Icon + Mini Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <span style={{ fontSize: '0.75rem' }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audio.volume}
          onChange={(e) => handleVolume && handleVolume(audio.id, parseFloat(e.target.value))}
          style={{ width: '40px', height: '3px', accentColor: 'var(--v14-color-primary)', cursor: 'pointer' }}
          aria-label="Âm lượng"
        />
      </div>
    </div>
  );
};
