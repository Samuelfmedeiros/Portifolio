"use client";

import { useEffect, useRef } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

// ─── Types (mirrored from SplashScreen to avoid circular dep) ───
type AnimationPhase = "initial" | "falling" | "walking" | "digging" | "revealed";
type DigCount = 0 | 1 | 2 | 3;

export interface TatuRiveProps {
  /** URL or path to the .riv asset (/tatu.riv by default) */
  src: string;
  /** Current animation phase from the parent state machine */
  phase: AnimationPhase;
  /** Current dig count (0-3) — increments each dig cycle */
  digCount: DigCount;
  /** Name of the state machine in the .riv file (default: "State Machine 1") */
  stateMachineName?: string;
  /** Name of the trigger input for one dig animation cycle */
  cavarTriggerName?: string;
  /** Name of the boolean input that enables the walking animation */
  andandoInputName?: string;
  /** Name of the boolean input that enables the revealed/portal burst */
  reveladoInputName?: string;
}

/**
 * TatuRive — Rive animation wrapper for the Tatu (armadillo) character.
 *
 * Bridges the SplashScreen's CSS-driven animation state machine with a
 * Rive state machine. Accepts a .riv file, connects trigger/boolean
 * inputs by name, and fires/sets them in response to phase + digCount
 * changes from the parent.
 *
 * Gracefully handles missing inputs (useStateMachineInput → null) so
 * the component works with placeholder .riv files while the real tatu
 * animation is being authored in the Rive editor.
 */
export function TatuRive({
  src,
  phase,
  digCount,
  stateMachineName = "State Machine 1",
  cavarTriggerName = "CavarGatilho",
  andandoInputName = "Andando",
  reveladoInputName = "Revelado",
}: TatuRiveProps) {
  // ── Track previous values to avoid duplicate fires ──
  const prevPhaseRef = useRef<AnimationPhase>(phase);
  const prevDigRef = useRef<DigCount>(digCount);

  // ── Load the Rive file — starts the state machine automatically ──
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay: true,
    artboard: "Avatar",
  });

  // ── Grab named inputs from the Rive state machine (null if missing) ──
  const cavar = useStateMachineInput(rive, stateMachineName, cavarTriggerName);
  const andando = useStateMachineInput(rive, stateMachineName, andandoInputName);
  const revelado = useStateMachineInput(rive, stateMachineName, reveladoInputName);

  // ── Sync parent phase + digCount → Rive inputs ──
  useEffect(() => {
    if (!rive) return;

    const wasDigging = prevPhaseRef.current === "digging";
    const nowDigging = phase === "digging";

    // ── Phase transitions ──
    if (phase !== prevPhaseRef.current) {
      switch (phase) {
        case "walking":
          andando && (andando.value = true);
          revelado && (revelado.value = false);
          break;

        case "digging":
          // First cavar — fire trigger on entering digging
          cavar && cavar.fire();
          andando && (andando.value = false);
          revelado && (revelado.value = false);
          break;

        case "revealed":
          revelado && (revelado.value = true);
          andando && (andando.value = false);
          break;

        default:
          // initial / falling — idle
          andando && (andando.value = false);
          revelado && (revelado.value = false);
          break;
      }
    }

    // ── Dig progress — fire trigger on each digCount increment ──
    if (nowDigging && digCount !== prevDigRef.current) {
      cavar && cavar.fire();
    }

    prevPhaseRef.current = phase;
    prevDigRef.current = digCount;
  }, [phase, digCount, rive, cavar, andando, revelado]);

  return (
    <RiveComponent
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
