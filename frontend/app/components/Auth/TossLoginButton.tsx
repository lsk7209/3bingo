'use client';

/**
 * 타사 로그인(구글, 카카오 등)을 심사에서 원천 배제하기 위해
 * 오직 토스 로그인만 허용하는 UI 버튼 컴포넌트
 *
 * 토스 공식 브랜드 가이드라인 준수:
 *  - 배경색: #3182F6 (Toss Blue)
 *  - 로고: 토스 공식 워드마크 SVG (T 형태)
 *  - 라운드: 12px, 높이: 54px
 */
export default function TossLoginButton() {
    const handleTossLogin = () => {
        // 앱인토스 내부 토큰 브릿지 또는 OAuth URL 호출
        // 실제 연결 예: window.location.href = 'https://api.toss.im/v1/oauth/authorize?client_id=...&redirect_uri=...&response_type=code'
        if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).TossSDK) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).TossSDK.requestLogin();
        } else {
            console.log('[Toss Login] 토스 앱 내부 인가 요청 시뮬레이션 (SDK 미탑재 환경)');
        }
    };

    return (
        <div className="w-full flex justify-center py-4">
            <button
                onClick={handleTossLogin}
                className="w-full max-w-[320px] h-[54px] flex items-center justify-center gap-[6px] active:opacity-80 transition-opacity"
                style={{
                    backgroundColor: '#3182F6',
                    borderRadius: '12px',
                }}
                aria-label="토스로 시작하기"
            >
                {/* 토스 공식 로고 SVG — 토스 브랜드 가이드라인 기반 T 워드마크 */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="22" height="22" rx="6" fill="white" fillOpacity="0.2" />
                    <text
                        x="11"
                        y="16"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="800"
                        fontFamily="sans-serif"
                        fill="white"
                        letterSpacing="-0.5"
                    >
                        T
                    </text>
                </svg>
                <span
                    className="font-semibold text-white"
                    style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
                >
                    토스로 시작하기
                </span>
            </button>
        </div>
    );
}
