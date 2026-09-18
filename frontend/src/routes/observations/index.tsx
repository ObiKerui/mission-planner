import { SkyViewer } from "@/components/sky-viewer/SkyViewer";
import VideoWatcher, {
  type VideoWatcherHandle,
} from "@/components/video-viewer/VideoViewer";
import { useObservations } from "@/entities/observations";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/observations/")({
  component: ObservationsPage,
});

function ObservationsPage() {
  const { data } = useObservations();
  const videoWatcherRef = useRef<VideoWatcherHandle>(null);
  const videoSrc = "test.mp4";
  const fps = 25;

  const [currentFrame, setCurrentFrame] = useState(0);

  return (
    <div>
      <h1 className="text-3xl font-bold">Observations</h1>
      <p className="mt-2 text-muted-foreground">
        Astronomical observations available for investigation.
      </p>
      {JSON.stringify(data)}
      <div className="border border-red-200">
        <SkyViewer />
      </div>
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}/observations/TEST-OBS-001/image`}
        alt="Observation"
        className="max-w-full"
      />
      <div>
        <VideoWatcher
          ref={videoWatcherRef}
          src={videoSrc}
          fps={fps}
          onFrameChange={setCurrentFrame}
          // onMetadataLoaded={setVideoMetadata}
          // onVideoElementReady={setVideoElement}
        />
      </div>
    </div>
  );
}
