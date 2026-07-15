/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  output: 'export',
  env: {
    REACT_APP_BASE_URL: 'http://localhost:8000/',
    PUBLIC_URL: 'http://localhost:3000/'
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src']
  },
  reactStrictMode: false,
  experimental: {
    esmExternals: false
  },
  webpack: (config, { dev, isServer }) => {
    // Alias for apexcharts
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    // Fix ENOENT race condition on Windows:
    // Disable filesystem cache in dev — Next.js rebuilds it fresh each run.
    // This prevents stale .pack file references after a cache wipe.
    if (dev) {
      config.cache = false
    }

    return config
  }
})
