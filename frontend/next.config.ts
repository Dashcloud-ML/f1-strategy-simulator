/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // produces frontend/out — plain static files, deployable to S3
  images: {
    unoptimized: true, // next/image's optimization needs a server; unavailable in static export
  },
};

module.exports = nextConfig;