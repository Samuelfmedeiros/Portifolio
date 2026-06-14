import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Portifolio Samuel — Samuel Medeiros Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Scanline effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.03) 2px, rgba(34,211,238,0.03) 4px)",
          }}
        />

        {/* Accent line */}
        <div
          style={{
            width: 200,
            height: 1,
            background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
            marginBottom: 40,
          }}
        />

        {/* Main title */}
        <h1
          style={{
            color: "#22d3ee",
            fontSize: 72,
            fontWeight: "bold",
            letterSpacing: "-0.05em",
            margin: "0 0 10px 0",
          }}
        >
          MISSION CONTROL
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "#94a3b8",
            fontSize: 28,
            letterSpacing: "0.1em",
            margin: "0 0 40px 0",
          }}
        >
          SAMUEL ANDRADE
        </p>

        {/* Accent line */}
        <div
          style={{
            width: 200,
            height: 1,
            background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
            marginBottom: 30,
          }}
        />

        {/* Tags */}
        <div style={{ display: "flex", gap: 16 }}>
          {["BI & SQL", "Python", "Machine Learning", "Next.js"].map(
            (tag) => (
              <span
                key={tag}
                style={{
                  color: "#22d3ee",
                  fontSize: 16,
                  padding: "6px 16px",
                  borderRadius: 9999,
                  border: "1px solid rgba(34,211,238,0.3)",
                  background: "rgba(34,211,238,0.05)",
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>

        {/* Footer */}
        <p
          style={{
            position: "absolute",
            bottom: 30,
            color: "#475569",
            fontSize: 14,
          }}
        >
          samuelandrade.dev
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
