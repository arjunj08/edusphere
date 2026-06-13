import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useAttentionSignal, type Load, type SignalSource } from "@/hooks/useAttentionSignal";

/**
 * Holds the opt-in state and live output of the Cognitive Load Sensor so any
 * surface can react to it. The sensor is OFF by default and the user controls
 * it. Nothing here is persisted — no signal leaves the device or the session.
 */
interface SensingContextValue {
  sensorEnabled: boolean;
  setSensorEnabled: (on: boolean) => void;
  load: Load;
  source: SignalSource;
}

const SensingContext = createContext<SensingContextValue | null>(null);

export function SensingProvider({ children }: { children: ReactNode }) {
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const { load, source } = useAttentionSignal(sensorEnabled);

  const value = useMemo<SensingContextValue>(
    () => ({ sensorEnabled, setSensorEnabled, load, source }),
    [sensorEnabled, load, source]
  );

  return <SensingContext.Provider value={value}>{children}</SensingContext.Provider>;
}

export function useSensing() {
  const ctx = useContext(SensingContext);
  if (!ctx) throw new Error("useSensing must be used within SensingProvider");
  return ctx;
}
