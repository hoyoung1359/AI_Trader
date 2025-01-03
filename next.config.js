/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // 서버 컴포넌트 관련 설정
    serverActions: true,
  },
  // hydration 에러 무시
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 