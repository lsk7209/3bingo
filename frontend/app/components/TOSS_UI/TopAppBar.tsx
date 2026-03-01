'use client';

import { useRouter } from 'next/navigation';

interface TopAppBarProps {
    title?: string;
    /** 우측 액션 영역 (옵션). 없으면 좌측 버튼과 대칭을 위한 빈 공간으로 처리 */
    rightAction?: React.ReactNode;
    /** 뒤로가기 버튼 노출 여부 (홈 화면 등에서 숨김) */
    showBack?: boolean;
}

// TDS AppBar 가이드라인:
// - 높이: 56px 고정
// - 좌측: back 버튼(40×40), 우측: 액션 버튼(40×40) — 대칭 구조로 타이틀 자동 중앙 정렬
// - 배경: rgba(white, 0.9) + backdrop-blur (토스 앱과 동일한 frost glass 처리)
// - 타이틀: text-[17px] font-semibold, color: #191F28
export default function TopAppBar({
    title = '오늘의 갓생 빙고',
    rightAction,
    showBack = true,
}: TopAppBarProps) {
    const router = useRouter();

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 flex items-center px-1 bg-white/90 backdrop-blur-md border-b border-gray-100/60"
            style={{ height: '56px' }}
        >
            {/* 좌측: 뒤로가기 버튼 — 40×40으로 터치 영역 확보 */}
            <div className="w-10 flex-shrink-0 flex items-center justify-center">
                {showBack && (
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center text-gray-800 active:opacity-50 transition-opacity"
                        aria-label="뒤로가기"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>

            {/* 중앙: 타이틀 — flex-1로 양쪽 40px 버튼과 대칭, 별도 translate 불필요 */}
            <h1
                className="flex-1 text-center font-semibold"
                style={{ fontSize: '17px', color: '#191F28', letterSpacing: '-0.01em' }}
            >
                {title}
            </h1>

            {/* 우측: 액션 버튼 영역 — 좌측과 동일한 40px 고정으로 타이틀 중앙 유지 */}
            <div className="w-10 flex-shrink-0 flex items-center justify-center">
                {rightAction ?? null}
            </div>
        </header>
    );
}
