/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['www.ecp.org.br']
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ecp.org.br',
      },
    ],
  },
}
// www.ecp.org.br
module.exports = nextConfig
