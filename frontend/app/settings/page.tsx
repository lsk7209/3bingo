'use client';

/**
 * [Template: Menu/Settings Page]
 * 이 페이지는 TDS(토스 디자인 시스템)의 Menu Group UI 구현 예시입니다.
 * 서비스 설정, 고객센터, 프로필 정보 구성 시 이 템플릿을 활용하세요.
 */

// 설정 페이지 (TDS Menu/Group UI)
export default function SettingsPage() {
    const menuGroups = [
        {
            title: '게임 설정',
            items: [
                { label: '배경음악', value: '켜짐', hasToggle: true },
                { label: '효과음', value: '켜짐', hasToggle: true },
                { label: '햅틱 피드백', value: '켜짐', hasToggle: true },
            ]
        },
        {
            title: '서비스 정보',
            items: [
                { label: '버전 정보', value: '1.0.0' },
                { label: '이용약관', hasArrow: true },
                { label: '개인정보 처리방침', hasArrow: true },
                { label: '오픈소스 라이선스', hasArrow: true },
            ]
        },
        {
            title: '고객센터',
            items: [
                { label: '자주 묻는 질문', hasArrow: true },
                { label: '1:1 문의하기', hasArrow: true },
                { label: '광고 문의', hasArrow: true },
            ]
        }
    ];

    return (
        <div className="flex flex-col bg-[#F9FAFB] min-h-full pb-10">

            {/* 프로필 요약 (Mock) */}
            <div className="bg-white px-5 py-8 flex flex-col items-center space-y-3">
                <div className="w-20 h-20 bg-[#F2F4F6] rounded-full flex items-center justify-center text-3xl">
                    🧩
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-[#191F28]">퍼즐 마스터</h2>
                    <p className="text-[14px] text-[#4E5968]">puzzle_user_772</p>
                </div>
                <button className="px-4 py-2 bg-[#F2F4F6] text-[#4E5968] text-[13px] font-bold rounded-full active:scale-95 transition-all">
                    프로필 수정
                </button>
            </div>

            {/* 메뉴 그룹 리스트 */}
            {menuGroups.map((group, gIdx) => (
                <div key={gIdx} className="mt-4 bg-white border-y border-[#F2F4F6]">
                    <div className="px-5 pt-5 pb-2">
                        <span className="text-[13px] font-bold text-[#3182F6]">{group.title}</span>
                    </div>
                    <div className="divide-y divide-[#F2F4F6]">
                        {group.items.map((item, iIdx) => (
                            <div key={iIdx} className="px-5 py-4 flex items-center justify-between active:bg-gray-50 transition-colors">
                                <span className="text-[16px] font-medium text-[#191F28]">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    {item.value && <span className="text-[15px] text-[#8B95A1]">{item.value}</span>}
                                    {item.hasToggle && (
                                        <div className="w-11 h-6 bg-[#3182F6] rounded-full relative">
                                            <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    )}
                                    {item.hasArrow && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 5L16 12L9 19" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* 계정 관리 */}
            <div className="px-5 py-10 flex flex-col items-center gap-4">
                <button className="text-[14px] text-[#8B95A1] underline underline-offset-4">로그아웃</button>
                <button className="text-[12px] text-[#B0B8C1]">회원 탈퇴</button>
            </div>

        </div>
    );
}
