import { useAudioPlayer } from './AudioPlayerContext';
import { Play, Pause, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayerWidget() {
  const { currentTrack, isPlaying, currentTime, duration, pause, resume, stop, seek } = useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 px-4 py-3">
      <div className="container max-w-4xl mx-auto flex items-center gap-4">
        {/* Cover image */}
        {currentTrack.coverUrl && (
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (isPlaying ? pause() : resume())}
          className="flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Track info and progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-sm font-semibold text-foreground truncate">
              {currentTrack.title}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={([value]) => {
              const newTime = (value / 100) * duration;
              seek(newTime);
            }}
            className="w-full"
          />
        </div>

        {/* Volume indicator */}
        <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={stop}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
