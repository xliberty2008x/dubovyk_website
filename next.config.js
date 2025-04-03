/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  output: 'standalone', // Add this line for Docker deployment
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
