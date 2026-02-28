'use client';

/**
 * [Template: List UI Page]
 * 이 페이지는 TDS(토스 디자인 시스템)의 List UI 구현 예시입니다.
 * 서비스 기록, 활동 내역 등을 표시할 때 이 템플릿을 활용하세요.
 */

// 최근 게임 기록 페이지 (TDS List UI)
export default function HistoryPage() {
    // Mock Data
    const historyData = [
        { id: 1, date: '2026.02.28', time: '14:20', moves: 42, result: '성공', duration: '1분 12초' },
        { id: 2, date: '2026.02.28', time: '11:05', moves: 12, result: '포기', duration: '15초' },
        { id: 3, date: '2026.02.27', time: '22:45', moves: 89, result: '성공', duration: '3분 45초' },
        { id: 4, date: '2026.02.27', time: '18:30', moves: 55, result: '성공', duration: '2분 10초' },
    ];

    return (
        <div className="flex flex-col bg-[#F9FAFB] min-h-full">

            {/* 통계 요약 섹션 */}
            <div className="bg-white px-5 py-6 border-b border-[#F2F4F6] space-y-4">
                <h2 className="text-2xl font-bold text-[#191F28]">내 퍼즐 기록</h2>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#F9FAFB] p-4 rounded-2xl text-center space-y-1">
                        <span className="text-[11px] text-[#8B95A1] font-medium">최고 횟수</span>
                        <p className="text-lg font-bold text-[#191F28]">12회</p>
                    </div>
                    <div className="bg-[#F9FAFB] p-4 rounded-2xl text-center space-y-1">
                        <span className="text-[11px] text-[#8B95A1] font-medium">성공률</span>
                        <p className="text-lg font-bold text-[#3182F6]">85%</p>
                    </div>
                    <div className="bg-[#F9FAFB] p-4 rounded-2xl text-center space-y-1">
                        <span className="text-[11px] text-[#8B95A1] font-medium">누적 횟수</span>
                        <p className="text-lg font-bold text-[#191F28]">24회</p>
                    </div>
                </div>
            </div>

            {/* 기록 리스트 섹션 */}
            <div className="bg-white mt-3 p-0">
                <div className="px-5 py-4">
                    <span className="text-[13px] font-bold text-[#4E5968]">최근 기록</span>
                </div>

                <div className="divide-y divide-[#F2F4F6]">
                    {historyData.map((item) => (
                        <div key={item.id} className="px-5 py-5 flex items-center justify-between active:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${item.result === '성공' ? 'bg-[#EFF6FF]' : 'bg-gray-100 opacity-60'}`}>
                                    {item.result === '성공' ? '🏆' : '🏳️'}
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-[#191F28]">{item.result === '성공' ? `${item.moves}회만에 성공` : '아쉬운 포기'}</h3>
                                    <p className="text-[13px] text-[#8B95A1]">{item.date} · {item.time} · {item.duration}</p>
                                </div>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5L16 12L9 19" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* 하단 여백 확보 */}
                <div className="h-10"></div>
            </div>

        </div>
    );
}
