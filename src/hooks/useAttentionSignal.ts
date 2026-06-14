import { useEffect, useRef, useState } from "react";

/**
 * On-device attention/strain proxy for the Cognitive Cam.
 *
 * PRIVACY: when a camera is used, frames are analysed in-browser only — nothing
 * is recorded, stored, or uploaded, and the stream stops the moment the sensor
 * is turned off. Where the experimental FaceDetector API exists we use real
 * face-presence; otherwise the live camera still runs (so you can see it work)
 * and the load estimate falls back to a time-on-screen heuristic. If the camera
 * is unavailable or permission is denied, we degrade to a fully simulated
 * signal so the feature is always demoable.
 */

export type Load = "calm" | "focused" | "strained";
export type SignalSource = "camera" | "simulated" | "off";

interface AttentionState {
  load: Load;
  source: SignalSource;
  /** Live MediaStream when the camera is on, so the UI can show a preview. */
  stream: MediaStream | null;
}

// FaceDetector is experimental and not in TS DOM libs; declare a minimal shape.
interface FaceDetectorLike {
  detect: (source: CanvasImageSource) => Promise<unknown[]>;
}
declare global {
  interface Window {
    FaceDetector?: new () => FaceDetectorLike;
  }
}

export function useAttentionSignal(enabled: boolean): AttentionState {
  const [state, setState] = useState<AttentionState>({ load: "calm", source: "off", stream: null });
  const streamRef = useRef<MediaStream | null>(null);
  const missesRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setState({ load: "calm", source: "off", stream: null });
      return;
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    let video: HTMLVideoElement | null = null;
    let detector: FaceDetectorLike | null = null;
    const startedAt = Date.now();

    async function start() {
      let cameraOn = false;

      // Always try the camera when enabled — not gated on FaceDetector.
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, facingMode: "user" },
          });
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          cameraOn = true;
          video = document.createElement("video");
          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;
          await video.play().catch(() => {});
          if (window.FaceDetector) {
            try {
              detector = new window.FaceDetector();
            } catch {
              detector = null;
            }
          }
          setState({ load: "focused", source: "camera", stream });
        } catch {
          cameraOn = false;
        }
      }

      interval = setInterval(async () => {
        if (detector && video) {
          // Real face-presence detection.
          try {
            const faces = await detector.detect(video);
            if (faces.length > 0) {
              missesRef.current = 0;
              setState((s) => ({ ...s, load: "focused", source: "camera" }));
            } else {
              missesRef.current += 1;
              setState((s) => ({
                ...s,
                load: missesRef.current >= 3 ? "strained" : "focused",
                source: "camera",
              }));
            }
          } catch {
            /* transient detector error — ignore this tick */
          }
        } else {
          // Camera may still be live (preview works); estimate load from time.
          const elapsed = (Date.now() - startedAt) / 1000;
          const load: Load = elapsed > 40 ? "strained" : elapsed > 18 ? "focused" : "calm";
          setState((s) => ({
            ...s,
            load,
            source: cameraOn ? "camera" : "simulated",
          }));
        }
      }, detector ? 1500 : 2000);
    }

    start();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [enabled]);

  return state;
}
