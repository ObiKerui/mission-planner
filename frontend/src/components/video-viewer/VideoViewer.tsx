import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface VideoMetadata {
  duration: number;
  fps: number;
  frameCount: number;
  width: number;
  height: number;
}

export interface VideoWatcherHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;

  goToBeginning: () => void;

  nextFrame: () => void;
  previousFrame: () => void;

  seekToFrame: (frame: number) => void;
  seekToTime: (time: number) => void;

  getCurrentFrame: () => number;
  getCurrentTime: () => number;

  getVideoElement: () => HTMLVideoElement | null;
}

export interface VideoWatcherProps {
  /**
   * Video URL.
   */
  src?: string;

  /**
   * Logical video frame rate.
   *
   * Used to convert:
   *
   * frame -> time
   * time -> frame
   *
   * Default: 25
   */
  fps?: number;

  /**
   * Called whenever the logical current frame changes.
   *
   * Frame numbers are ZERO based.
   */
  onFrameChange?: (frame: number) => void;

  /**
   * Called once the browser has loaded the video metadata.
   */
  onMetadataLoaded?: (metadata: VideoMetadata) => void;

  /**
   * Gives the parent access to the underlying HTMLVideoElement.
   */
  onVideoElementReady?: (video: HTMLVideoElement) => void;

  /**
   * Optional class for the outer component.
   */
  className?: string;
}

const VideoWatcher = forwardRef<VideoWatcherHandle, VideoWatcherProps>(
  function VideoWatcher(
    {
      src,
      fps = 25,
      onFrameChange,
      onMetadataLoaded,
      onVideoElementReady,
      className = "",
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);

    const animationFrameRef = useRef<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);

    const [playbackRate, setPlaybackRate] = useState(1);

    /*
     * Used while dragging the timeline.
     *
     * We don't continually change the video's currentTime on every
     * React render. Instead we directly seek while dragging and then
     * update React state.
     */
    const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

    /*
     * Used by the frame-number input.
     *
     * This is deliberately separate from currentFrame so that the user
     * can type "183" without React immediately replacing it.
     */
    const [frameInput, setFrameInput] = useState("");

    /*
     * ------------------------------------------------------------------
     * Derived values
     * ------------------------------------------------------------------
     */

    const frameCount =
      duration > 0 ? Math.max(1, Math.round(duration * fps)) : 0;

    /*
     * Logical frame represented by currentTime.
     *
     * ZERO based.
     *
     * Example:
     *
     * time = 0
     * fps  = 25
     *
     * frame = 0
     */
    const currentFrame =
      duration > 0
        ? Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(currentTime * fps + 0.00001)),
          )
        : 0;

    const progress =
      duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;

    /*
     * ------------------------------------------------------------------
     * Keep parent informed of the current frame.
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      if (frameCount <= 0) {
        return;
      }

      onFrameChange?.(currentFrame);

      /*
       * Keep the frame input synchronised when we're not actively typing
       * or dragging.
       */
      if (!isDraggingTimeline) {
        setFrameInput(String(currentFrame + 1));
      }
    }, [currentFrame, frameCount, isDraggingTimeline, onFrameChange]);

    /*
     * ------------------------------------------------------------------
     * Utility functions
     * ------------------------------------------------------------------
     */

    const clampFrame = useCallback(
      (frame: number) => {
        if (frameCount <= 0) {
          return 0;
        }

        return Math.max(0, Math.min(frameCount - 1, Math.round(frame)));
      },
      [frameCount],
    );

    const clampTime = useCallback(
      (time: number) => {
        if (duration <= 0) {
          return 0;
        }

        return Math.max(0, Math.min(duration, time));
      },
      [duration],
    );

    /*
     * ------------------------------------------------------------------
     * Time / frame formatting
     * ------------------------------------------------------------------
     */

    const formatTime = useCallback((time: number) => {
      const safeTime = Math.max(0, time);

      const hours = Math.floor(safeTime / 3600);

      const minutes = Math.floor((safeTime % 3600) / 60);

      const seconds = Math.floor(safeTime % 60);

      const milliseconds = Math.floor((safeTime % 1) * 1000);

      if (hours > 0) {
        return (
          `${hours.toString().padStart(2, "0")}:` +
          `${minutes.toString().padStart(2, "0")}:` +
          `${seconds.toString().padStart(2, "0")}.` +
          `${milliseconds.toString().padStart(3, "0")}`
        );
      }

      return (
        `${minutes.toString().padStart(2, "0")}:` +
        `${seconds.toString().padStart(2, "0")}.` +
        `${milliseconds.toString().padStart(3, "0")}`
      );
    }, []);

    /*
     * ------------------------------------------------------------------
     * Update playback state
     * ------------------------------------------------------------------
     */

    const updatePlaybackState = useCallback(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      setCurrentTime(video.currentTime);
    }, []);

    /*
     * ------------------------------------------------------------------
     * Animation loop while playing
     *
     * This gives us considerably smoother timeline/frame updates than
     * relying purely on "timeupdate".
     * ------------------------------------------------------------------
     */

    const stopAnimationLoop = useCallback(() => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }, []);

    const startAnimationLoop = useCallback(() => {
      stopAnimationLoop();

      const update = () => {
        const video = videoRef.current;

        if (!video || video.paused || video.ended) {
          animationFrameRef.current = null;
          return;
        }

        setCurrentTime(video.currentTime);

        animationFrameRef.current = requestAnimationFrame(update);
      };

      animationFrameRef.current = requestAnimationFrame(update);
    }, [stopAnimationLoop]);

    /*
     * ------------------------------------------------------------------
     * Play
     * ------------------------------------------------------------------
     */

    const play = useCallback(() => {
      const video = videoRef.current;

      if (!video || !src) {
        return;
      }

      /*
       * If we're already at the end, restart from the beginning.
       */
      if (video.ended || video.currentTime >= video.duration) {
        video.currentTime = 0;
        setCurrentTime(0);
      }

      video.playbackRate = playbackRate;

      void video.play();
    }, [playbackRate, src]);

    /*
     * ------------------------------------------------------------------
     * Pause
     * ------------------------------------------------------------------
     */

    const pause = useCallback(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.pause();

      setCurrentTime(video.currentTime);

      stopAnimationLoop();
    }, [stopAnimationLoop]);

    /*
     * ------------------------------------------------------------------
     * Toggle play/pause
     * ------------------------------------------------------------------
     */

    const togglePlay = useCallback(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      if (video.paused) {
        play();
      } else {
        pause();
      }
    }, [pause, play]);

    /*
     * ------------------------------------------------------------------
     * Seek to a specific time
     * ------------------------------------------------------------------
     */

    const seekToTime = useCallback(
      (time: number) => {
        const video = videoRef.current;

        if (!video || duration <= 0) {
          return;
        }

        const newTime = clampTime(time);

        video.currentTime = newTime;

        setCurrentTime(newTime);
      },
      [clampTime, duration],
    );

    /*
     * ------------------------------------------------------------------
     * Seek to a specific frame
     * ------------------------------------------------------------------
     */

    const seekToFrame = useCallback(
      (frame: number) => {
        const video = videoRef.current;

        if (!video || frameCount <= 0 || fps <= 0) {
          return;
        }

        const clampedFrame = clampFrame(frame);

        /*
         * Convert logical frame number to timestamp.
         *
         * Frame 0 -> 0 / fps
         * Frame 1 -> 1 / fps
         * Frame 2 -> 2 / fps
         */
        const time = clampedFrame / fps;

        video.currentTime = time;

        setCurrentTime(time);

        setFrameInput(String(clampedFrame + 1));
      },
      [clampFrame, fps, frameCount],
    );

    /*
     * ------------------------------------------------------------------
     * Previous frame
     * ------------------------------------------------------------------
     */

    const previousFrame = useCallback(() => {
      /*
       * Frame stepping should pause playback.
       *
       * Otherwise the video can immediately advance again while the
       * user is trying to inspect a frame.
       */
      pause();

      seekToFrame(currentFrame - 1);
    }, [currentFrame, pause, seekToFrame]);

    /*
     * ------------------------------------------------------------------
     * Next frame
     * ------------------------------------------------------------------
     */

    const nextFrame = useCallback(() => {
      pause();

      seekToFrame(currentFrame + 1);
    }, [currentFrame, pause, seekToFrame]);

    /*
     * ------------------------------------------------------------------
     * Go to beginning
     * ------------------------------------------------------------------
     */

    const goToBeginning = useCallback(() => {
      pause();

      seekToFrame(0);
    }, [pause, seekToFrame]);

    /*
     * ------------------------------------------------------------------
     * Video element
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      onVideoElementReady?.(video);
    }, [onVideoElementReady]);

    /*
     * ------------------------------------------------------------------
     * Metadata
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const handleLoadedMetadata = () => {
        const newDuration = Number.isFinite(video.duration)
          ? video.duration
          : 0;

        const width = video.videoWidth;
        const height = video.videoHeight;

        setDuration(newDuration);

        setVideoWidth(width);
        setVideoHeight(height);

        setCurrentTime(video.currentTime);

        const newFrameCount =
          newDuration > 0 ? Math.max(1, Math.round(newDuration * fps)) : 0;

        onMetadataLoaded?.({
          duration: newDuration,
          fps,
          frameCount: newFrameCount,
          width,
          height,
        });
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }, [fps, onMetadataLoaded]);

    /*
     * ------------------------------------------------------------------
     * Video playback events
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const handlePlay = () => {
        setIsPlaying(true);
        startAnimationLoop();
      };

      const handlePause = () => {
        setIsPlaying(false);
        setCurrentTime(video.currentTime);
        stopAnimationLoop();
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(video.currentTime);
        stopAnimationLoop();
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handleSeeking = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("seeking", handleSeeking);

      return () => {
        video.removeEventListener("play", handlePlay);

        video.removeEventListener("pause", handlePause);

        video.removeEventListener("ended", handleEnded);

        video.removeEventListener("timeupdate", handleTimeUpdate);

        video.removeEventListener("seeking", handleSeeking);

        stopAnimationLoop();
      };
    }, [startAnimationLoop, stopAnimationLoop]);

    /*
     * ------------------------------------------------------------------
     * Keep playback rate synchronised with the video.
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.playbackRate = playbackRate;
    }, [playbackRate]);

    /*
     * ------------------------------------------------------------------
     * Timeline position -> frame
     * ------------------------------------------------------------------
     */

    const getFrameFromPointer = useCallback(
      (clientX: number) => {
        const timeline = timelineRef.current;

        if (!timeline || frameCount <= 0) {
          return 0;
        }

        const rect = timeline.getBoundingClientRect();

        if (rect.width <= 0) {
          return 0;
        }

        const position = (clientX - rect.left) / rect.width;

        const clampedPosition = Math.max(0, Math.min(1, position));

        return Math.round(clampedPosition * (frameCount - 1));
      },
      [frameCount],
    );

    /*
     * ------------------------------------------------------------------
     * Timeline click
     * ------------------------------------------------------------------
     */

    const handleTimelinePointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (frameCount <= 0) {
          return;
        }

        /*
         * Capture the pointer so dragging continues even if the
         * pointer moves outside the timeline.
         */
        event.currentTarget.setPointerCapture(event.pointerId);

        setIsDraggingTimeline(true);

        const frame = getFrameFromPointer(event.clientX);

        seekToFrame(frame);
      },
      [frameCount, getFrameFromPointer, seekToFrame],
    );

    /*
     * ------------------------------------------------------------------
     * Timeline dragging
     * ------------------------------------------------------------------
     */

    const handleTimelinePointerMove = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingTimeline) {
          return;
        }

        const frame = getFrameFromPointer(event.clientX);

        seekToFrame(frame);
      },
      [getFrameFromPointer, isDraggingTimeline, seekToFrame],
    );

    const handleTimelinePointerUp = useCallback(() => {
      setIsDraggingTimeline(false);
    }, []);

    /*
     * ------------------------------------------------------------------
     * Frame input
     * ------------------------------------------------------------------
     */

    const handleFrameInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrameInput(event.target.value);
      },
      [],
    );

    const commitFrameInput = useCallback(() => {
      const parsed = Number.parseInt(frameInput, 10);

      if (!Number.isFinite(parsed)) {
        setFrameInput(String(currentFrame + 1));
        return;
      }

      /*
       * UI frame numbers are one-based.
       *
       * Convert back to zero-based.
       */
      seekToFrame(parsed - 1);
    }, [currentFrame, frameInput, seekToFrame]);

    const handleFrameInputKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
          commitFrameInput();
        }

        if (event.key === "Escape") {
          setFrameInput(String(currentFrame + 1));

          event.currentTarget.blur();
        }
      },
      [commitFrameInput, currentFrame],
    );

    /*
     * ------------------------------------------------------------------
     * Keyboard shortcuts
     * ------------------------------------------------------------------
     *
     * Space       Play/pause
     * Left        Previous frame
     * Right       Next frame
     * Home        Beginning
     * Shift+Left  -10 frames
     * Shift+Right +10 frames
     * ------------------------------------------------------------------
     */

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;

        /*
         * Never hijack keyboard input from controls.
         */
        if (
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.tagName === "SELECT" ||
          target?.isContentEditable
        ) {
          return;
        }

        switch (event.code) {
          case "Space":
            event.preventDefault();
            togglePlay();
            break;

          case "ArrowLeft":
            event.preventDefault();

            if (event.shiftKey) {
              pause();
              seekToFrame(currentFrame - 10);
            } else {
              previousFrame();
            }

            break;

          case "ArrowRight":
            event.preventDefault();

            if (event.shiftKey) {
              pause();
              seekToFrame(currentFrame + 10);
            } else {
              nextFrame();
            }

            break;

          case "Home":
            event.preventDefault();
            goToBeginning();
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      currentFrame,
      goToBeginning,
      nextFrame,
      pause,
      previousFrame,
      seekToFrame,
      togglePlay,
    ]);

    /*
     * ------------------------------------------------------------------
     * Imperative API
     * ------------------------------------------------------------------
     */

    useImperativeHandle(
      ref,
      () => ({
        play,

        pause,

        togglePlay,

        goToBeginning,

        nextFrame,

        previousFrame,

        seekToFrame,

        seekToTime,

        getCurrentFrame: () => currentFrame,

        getCurrentTime: () => {
          return videoRef.current?.currentTime ?? 0;
        },

        getVideoElement: () => {
          return videoRef.current;
        },
      }),
      [
        currentFrame,
        goToBeginning,
        nextFrame,
        pause,
        play,
        previousFrame,
        seekToFrame,
        seekToTime,
        togglePlay,
      ],
    );

    /*
     * ------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------
     */

    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        {/* ----------------------------------------------------------
          Video
          ---------------------------------------------------------- */}

        <div className="relative w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            src={src}
            className="block h-auto w-full"
            preload="metadata"
            playsInline
          />

          {!src && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
              No video loaded
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------
          Timeline
          ---------------------------------------------------------- */}

        <div
          ref={timelineRef}
          className="group relative h-6 w-full cursor-pointer select-none touch-none"
          onPointerDown={handleTimelinePointerDown}
          onPointerMove={handleTimelinePointerMove}
          onPointerUp={handleTimelinePointerUp}
          onPointerCancel={handleTimelinePointerUp}
        >
          {/* Track */}

          <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-base-300">
            {/* Progress */}

            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          {/* Playhead */}

          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow transition-transform group-hover:scale-110"
            style={{
              left: `calc(${progress * 100}% - 8px)`,
            }}
          />
        </div>

        {/* ----------------------------------------------------------
          Main controls
          ---------------------------------------------------------- */}

        <div className="flex flex-wrap items-center gap-2">
          {/* Beginning */}

          <button
            type="button"
            className="btn btn-sm"
            onClick={goToBeginning}
            disabled={!src || frameCount <= 0}
            title="Go to beginning (Home)"
          >
            ⏮
          </button>

          {/* Previous frame */}

          <button
            type="button"
            className="btn btn-sm"
            onClick={previousFrame}
            disabled={!src || frameCount <= 0 || currentFrame <= 0}
            title="Previous frame (←)"
          >
            ◀
          </button>

          {/* Play / pause */}

          <button
            type="button"
            className="btn btn-sm btn-primary min-w-20"
            onClick={togglePlay}
            disabled={!src}
            title="Play / pause (Space)"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          {/* Next frame */}

          <button
            type="button"
            className="btn btn-sm"
            onClick={nextFrame}
            disabled={!src || frameCount <= 0 || currentFrame >= frameCount - 1}
            title="Next frame (→)"
          >
            ▶
          </button>

          {/* --------------------------------------------------------
            Frame counter / jump-to-frame
            -------------------------------------------------------- */}

          <div className="ml-2 flex items-center gap-1 text-sm">
            <span className="opacity-60">Frame</span>

            <input
              type="number"
              min={frameCount > 0 ? 1 : undefined}
              max={frameCount > 0 ? frameCount : undefined}
              value={frameInput}
              onChange={handleFrameInputChange}
              onBlur={commitFrameInput}
              onKeyDown={handleFrameInputKeyDown}
              disabled={!src || frameCount <= 0}
              className="input input-sm w-20 text-center font-mono"
              aria-label="Current frame"
            />

            <span className="opacity-60">/</span>

            <span className="font-mono">{frameCount || "—"}</span>
          </div>

          {/* --------------------------------------------------------
            Time
            -------------------------------------------------------- */}

          <div className="ml-2 whitespace-nowrap font-mono text-sm">
            <span>{formatTime(currentTime)}</span>

            <span className="opacity-50">
              {" / "}
              {formatTime(duration)}
            </span>
          </div>

          {/* --------------------------------------------------------
            Playback speed
            -------------------------------------------------------- */}

          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs opacity-60">Speed</span>

            <select
              className="select select-sm w-24"
              value={playbackRate}
              onChange={(event) => {
                setPlaybackRate(Number(event.target.value));
              }}
            >
              <option value={0.25}>0.25×</option>
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </div>

        {/* ----------------------------------------------------------
          Video metadata / keyboard help
          ---------------------------------------------------------- */}

        {frameCount > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-60">
            <span>
              {videoWidth} × {videoHeight}
            </span>

            <span>{fps} fps</span>

            <span>{frameCount} frames</span>

            <span className="ml-auto">
              Space: play/pause
              {" • "}
              ←/→: frame
              {" • "}
              Shift+←/→: ±10
              {" • "}
              Home: beginning
            </span>
          </div>
        )}
      </div>
    );
  },
);

export default VideoWatcher;
