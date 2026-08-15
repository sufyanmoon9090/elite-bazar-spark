import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.p057c3ef0992244a2b8c9e95187a60ebf",
  appName: "elite-bazar",
  // Built web assets are bundled into the native app container (offline capable).
  webDir: "dist",
  server: {
    // Hot-reload from the Lovable sandbox during development.
    // Remove this block (or comment it out) to ship a fully offline APK.
    url: "https://057c3ef0-9922-44a2-b8c9-e95187a60ebf.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
