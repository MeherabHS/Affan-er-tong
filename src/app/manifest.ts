import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Affan er Tong | Bangladesh Debate Learning Community",
    short_name: "Affan er Tong",
    description: "Bangladesh-based debate-learning community making debate education accessible.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E6",
    theme_color: "#E87525",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
