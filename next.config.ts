import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/Jack-Etzion-v25p.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="Jack-Etzion-Resume.pdf"',
          },
        ],
      },
    ];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
