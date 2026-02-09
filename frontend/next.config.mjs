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
    // Add alias for ai-engine directory
    config.resolve.alias['@ai-engine'] = path.resolve(__dirname, '../ai-engine/lib/ai-engine')
    config.resolve.alias['@ai-rules'] = path.resolve(__dirname, '../ai-engine/lib/rules')

    // Ensure JSON files can be imported from ai-engine
    config.module.rules.push({
      test: /\.json$/,
      include: path.resolve(__dirname, '../ai-engine'),
      type: 'json',
    })

    return config
  },
}

export default nextConfig
