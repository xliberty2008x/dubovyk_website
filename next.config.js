/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
