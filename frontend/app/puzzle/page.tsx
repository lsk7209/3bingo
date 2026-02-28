'use client';

/**
 * [Template: Game/Service Page]
 * 이 페이지는 보일러플레이트의 퍼즐 게임 구현 예시입니다.
 * 실제 서비스 개발 시 이 구조를 참조하여 비즈니스 로직을 변경하세요.
 */

import { useState, useEffect, useCallback } from 'react';

// 3x3 슬라이딩 퍼즐 로직
export default function PuzzlePage() {
    const [tiles, setTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isCleared, setIsCleared] = useState(false);

    // 초기화: 1~8까지 숫자와 빈 공간(0)을 섞음
    const initGame = useCallback(() => {
        let initialTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        // 피셔-예이츠 셔플 (단, 풀 수 있는 퍼즐인지 검증은 생략하고 단순 섞기)
        for (let i = initialTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialTiles[i], initialTiles[j]] = [initialTiles[j], initialTiles[i]];
        }
        setTiles(initialTiles);
        setMoves(0);
        setIsCleared(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleTileClick = (index: number) => {
        if (isCleared) return;

        const emptyIndex = tiles.indexOf(0);
        const row = Math.floor(index / 3);
        const col = index % 3;
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;

        // 인접한 칸인지 확인 (좌우상하)
        const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

        if (isAdjacent) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(prev => prev + 1);

            // 성공 여부 확인
            if (newTiles.join(',') === '1,2,3,4,5,6,7,8,0') {
                setIsCleared(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center px-4 pt-6 space-y-6">

            {/* 상단 정보 카드 */}
            <div className="w-full max-w-sm bg-white p-5 rounded-3xl border border-[#F2F4F6] shadow-sm flex justify-between items-center">
                <div className="space-y-1">
                    <span className="text-[13px] text-[#8B95A1] font-medium">진행 상태</span>
                    <h2 className="text-xl font-bold text-[#191F28]">{isCleared ? '🎉 클리어!' : '퍼즐을 맞춰보세요'}</h2>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[13px] text-[#8B95A1] font-medium">이동 횟수</span>
                    <p className="text-xl font-bold text-[#3182F6]">{moves}</p>
                </div>
            </div>

            {/* 퍼즐 보드 Area */}
            <div className="w-full max-w-sm aspect-square bg-[#F2F4F6] p-4 rounded-3xl grid grid-cols-3 gap-3">
                {tiles.map((tile, index) => (
                    <button
                        key={index}
                        onClick={() => handleTileClick(index)}
                        className={`
                            aspect-square rounded-2xl text-2xl font-bold transition-all duration-200 active:scale-95
                            ${tile === 0
                                ? 'bg-transparent cursor-default'
                                : 'bg-white text-[#191F28] shadow-sm hover:shadow-md'
                            }
                        `}
                    >
                        {tile !== 0 && tile}
                    </button>
                ))}
            </div>

            {/* 컨트롤 버튼 */}
            <div className="w-full max-w-sm space-y-3 pt-4">
                <button
                    onClick={initGame}
                    className="w-full h-14 bg-[#3182F6] text-white font-bold rounded-2xl active:scale-[0.98] transition-all"
                >
                    {isCleared ? '다시 시작하기' : '퍼즐 섞기'}
                </button>
                <p className="text-center text-[13px] text-[#B0B8C1] leading-relaxed">
                    빈 공간 근처의 숫자를 클릭하여<br />1부터 8까지 순서대로 맞춰보세요.
                </p>
            </div>

        </div>
    );
}
