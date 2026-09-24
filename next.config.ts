import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: cloudName
      ? [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            port: "",
            pathname: `/${cloudName}/image/upload/**`,
            search: "",
          },
        ]
      : [],
  },
};

export default nextConfig;
