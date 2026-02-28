'use client';

import { useEffect, useState } from 'react';

const AD_CLOSE_DELAY_MS = 5000; // 앱인토스 가이드라인: 최소 5초 후 닫기 버튼 활성화

export default function AdInterstitial() {
    const [isVisible, setIsVisible] = useState(false);
    const [canClose, setCanClose] = useState(false);
    const [countdown, setCountdown] = useState(Math.floor(AD_CLOSE_DELAY_MS / 1000));

    useEffect(() => {
        // 앱 진입 1초 후 전면광고 노출 (Type A 가이드라인)
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        return () => clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        // 광고 노출 후 5초 카운트다운
        const closeTimer = setTimeout(() => {
            setCanClose(true);
        }, AD_CLOSE_DELAY_MS);

        // 1초마다 카운트다운 업데이트
        const interval = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => {
            clearTimeout(closeTimer);
            clearInterval(interval);
        };
    }, [isVisible]);

    const closeAd = () => {
        if (!canClose) return;
        setIsVisible(false);
        setCanClose(false);
        setCountdown(Math.floor(AD_CLOSE_DELAY_MS / 1000));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80">
            <div className="bg-white w-[300px] h-[400px] rounded-2xl flex flex-col items-center justify-center relative p-6 overflow-hidden">

                {/* 닫기 버튼: 카운트다운 중에는 비활성, 5초 후 활성화 */}
                <button
                    onClick={closeAd}
                    disabled={!canClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                        backgroundColor: canClose ? '#F2F4F6' : '#E0E0E0',
                        color: canClose ? '#191F28' : '#9E9E9E',
                        cursor: canClose ? 'pointer' : 'not-allowed',
                    }}
                    aria-label={canClose ? '광고 닫기' : `${countdown}초 후 닫기 가능`}
                >
                    {canClose ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <span className="text-xs font-bold">{countdown}</span>
                    )}
                </button>

                {/* 광고 레이블 */}
                <span className="absolute top-4 left-4 text-[10px] font-medium text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                    광고
                </span>

                {/* 광고 콘텐츠 */}
                <div className="flex flex-col items-center justify-center flex-1 mt-8 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <text x="16" y="22" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="sans-serif" fill="#3182F6">T</text>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 text-center">토스페이먼츠 특별 혜택</h2>
                    <p className="text-gray-500 text-center text-sm leading-relaxed">지금 바로 확인해보세요!</p>
                </div>

                <button
                    onClick={closeAd}
                    disabled={!canClose}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 active:scale-95"
                    style={{
                        backgroundColor: canClose ? '#3182F6' : '#B0B8C1',
                        cursor: canClose ? 'pointer' : 'not-allowed',
                    }}
                >
                    {canClose ? '자세히 보기' : `${countdown}초 후 이동 가능`}
                </button>
            </div>
        </div>
    );
}
