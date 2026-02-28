import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── 보안 헤더 (토스 심사 및 OWASP 권장) ──────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 클릭재킹 방지
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // MIME 타입 스니핑 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          // XSS 필터 활성화 (구형 브라우저 호환)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HTTPS 강제 (운영 환경)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Referrer 정책
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 권한 정책 (불필요한 API 차단)
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // ─── 이미지 최적화 ────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.toss.im',
      },
      {
        protocol: 'https',
        hostname: 'assets.toss.im',
      },
    ],
  },
};

export default nextConfig;
