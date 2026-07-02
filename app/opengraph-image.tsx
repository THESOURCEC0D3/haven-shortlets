/**
 * Dynamic site-wide social share image, generated at build time by next/og's
 * ImageResponse. This is the picture that appears when someone shares the
 * homepage on WhatsApp, X, etc. Generating it in code avoids shipping/binary-
 * managing a static asset and keeps the brand text editable.
 *
 * Next automatically wires the resulting image into og:image / twitter:image
 * for the route segment this file lives in (here, the whole site root).
 */

import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — premium short-let apartments in Port Harcourt`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "#f59e0b",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div style={{ fontSize: "28px", fontWeight: 600 }}>
            Haven Shortlets · Port Harcourt
          </div>
        </div>
        <div style={{ fontSize: "64px", fontWeight: 700, lineHeight: 1.1 }}>
          Premium short-let apartments in Port Harcourt
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#f59e0b",
            marginTop: "32px",
            fontWeight: 600,
          }}
        >
          Book direct. Stay better. Pay less.
        </div>
      </div>
    ),
    { ...size },
  );
}
