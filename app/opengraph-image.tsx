import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "hitokuchi - ウイスキーレビュー"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1008 0%, #2d1a0a 40%, #1a1008 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative amber glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,160,74,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,94,52,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #D4A04A, #8B5E34, #D4A04A, transparent)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {/* Rock glass SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="120"
            height="120"
          >
            <path
              d="M5 5 L27 5 L27 7 L25 7 L22.5 26 Q22.5 28 20.5 28 L11.5 28 Q9.5 28 9.5 26 L7 7 L5 7 Z"
              fill="#D4A04A"
            />
            <path
              d="M9.8 9 L22.2 9 L20.8 19 L11.2 19 Z"
              fill="white"
              opacity="0.15"
            />
            <path
              d="M11.2 19 L20.8 19 L22 26 Q22 27.5 20.5 27.5 L11.5 27.5 Q10 27.5 10 26 Z"
              fill="#E8B44C"
            />
          </svg>

          {/* Site name */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#D4A04A",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            hitokuchi
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "rgba(232,180,76,0.8)",
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            ウイスキーをひとくち、感想をひとこと。
          </div>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #8B5E34, #D4A04A, #8B5E34, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
