import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Harnais de mesure : `ANALYZE=true npm run build` (passe webpack) génère le
// rapport de tailles + le treemap. Inactif par défaut (aucun effet sur le build
// normal Turbopack).
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyzer(nextConfig);
