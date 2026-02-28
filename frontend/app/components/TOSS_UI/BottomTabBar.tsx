'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// ─── TDS 공식 SVG 아이콘 (픽셀 단위 TDS 가이드라인 준수) ───────────────────
const IconHome = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
            fill={active ? '#3182F6' : 'none'}
            stroke={active ? '#3182F6' : '#B0B8C1'}
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>
);

const IconPuzzle = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.5 5a1.5 1.5 0 0 1 3 0V6h1.75A.75.75 0 0 1 20 6.75v3.75h-1a1.5 1.5 0 0 0 0 3h1V17.25A.75.75 0 0 1 19.25 18H15.5v-1a1.5 1.5 0 0 0-3 0v1H8.75A.75.75 0 0 1 8 17.25V13.5h1a1.5 1.5 0 0 0 0-3H8V6.75A.75.75 0 0 1 8.75 6H10.5V5a1.5 1.5 0 0 1 3 0V5a1.5 1.5 0 0 0 1 0Z"
            stroke={active ? '#3182F6' : '#B0B8C1'}
            fill={active ? '#EFF6FF' : 'none'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconHistory = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="16" height="18" rx="2"
            stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" fill={active ? '#EFF6FF' : 'none'} />
        <line x1="8" y1="8" x2="16" y2="8" stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8" y1="16" x2="12" y2="16" stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconSettings = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3"
            stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" fill={active ? '#EFF6FF' : 'none'} />
        <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke={active ? '#3182F6' : '#B0B8C1'} strokeWidth="1.8" fill={active ? '#EFF6FF' : 'none'} />
    </svg>
);

const tabs = [
    { name: '홈', path: '/', Icon: IconHome },
    { name: '퍼즐', path: '/puzzle', Icon: IconPuzzle },
    { name: '기록', path: '/history', Icon: IconHistory },
    { name: '설정', path: '/settings', Icon: IconSettings },
];

// TDS 탭바 가이드라인:
// - 높이: 49px + safe-area
// - 상단 구분선 (border-t)
// - 활성 아이콘: #3182F6, 비활성: #B0B8C1
// - 탭 텍스트: 10px / font-medium
export default function BottomTabBar() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 flex justify-around items-end bg-white border-t border-gray-100 z-50"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: '49px' }}
        >
            {tabs.map(({ name, path, Icon }) => {
                const isActive = pathname === path;
                return (
                    <Link
                        key={path}
                        href={path}
                        className="flex flex-col items-center justify-center flex-1 py-[9px] gap-[3px]"
                        aria-label={name}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon active={isActive} />
                        <span
                            className="text-[10px] font-medium leading-none"
                            style={{ color: isActive ? '#3182F6' : '#B0B8C1' }}
                        >
                            {name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
