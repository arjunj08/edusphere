import { useEffect, useRef, useState } from "react";

/**
 * On-device attention/strain proxy for the Cognitive Load Sensor.
 *
 * PRIVACY: when a camera is used, frames are analysed in-browser only via the
 * FaceDetector API — nothing is recorded, stored, or uploaded. The stream is
 * stopped the moment the sensor is turned off. If no camera or FaceDetector is
 * available, we fall back to a SIMULATED signal derived from time-on-page so
 * the feature is always demoable.
 */

export type Load = "calm" | "focused" | "strained";
export type SignalSource = "camera" | "simulated" | "off";

interface AttentionState {
  load: Load;
  source: SignalSource;
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
  const [state, setState] = useState<AttentionState>({ load: "calm", source: "off" });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const missesRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setState({ load: "calm", source: "off" });
      return;
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    const startedAt = Date.now();

    async function startCamera(): Promise<boolean> {
      if (!window.FaceDetector || !navigator.mediaDevices?.getUserMedia) return false;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 160, height: 120 } });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return false;
        }
        streamRef.current = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.muted = true;
        await video.play();
        videoRef.current = video;
        const detector = new window.FaceDetector!();

        interval = setInterval(async () => {
          try {
            const faces = await detector.detect(video);
            // Face present → focused; absent repeatedly → strained (looked away).
            if (faces.length > 0) {
              missesRef.current = 0;
              setState({ load: "focused", source: "camera" });
            } else {
              missesRef.current += 1;
              setState({
                load: missesRef.current >= 3 ? "strained" : "focused",
                source: "camera",
              });
            }
          } catch {
            /* transient detector error — ignore this tick */
          }
        }, 1500);
        return true;
      } catch {
        return false;
      }
    }

    function startSimulated() {
      // Strain ramps the longer the user stays without the page changing.
      // Activity (handled by the sensor component dispatching events) resets it.
      interval = setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        const load: Load = elapsed > 40 ? "strained" : elapsed > 18 ? "focused" : "calm";
        setState({ load, source: "simulated" });
      }, 2000);
    }

    startCamera().then((ok) => {
      if (cancelled) return;
      if (!ok) startSimulated();
    });

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [enabled]);

  return state;
}
