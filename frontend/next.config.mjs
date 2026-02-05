import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Empty turbopack config to silence warning
  turbopack: {},
  // Use webpack for external directory support with path alias
  webpack: (config) => {
    config.resolve.alias['@ai-engine'] = path.resolve(__dirname, '../ai-engine/lib/ai-engine')
    return config
  },
}

export default nextConfig
