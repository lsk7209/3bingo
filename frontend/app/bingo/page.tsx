'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { toCanvas } from 'html-to-image';

const missionPool = [
  { icon: "💧", text: "물 3컵 마시기" },
  { icon: "🚶", text: "동네 한 바퀴 산책" },
  { icon: "🥤", text: "카페에서 텀블러 사용" },
  { icon: "🧘‍♀️", text: "찌릿찌릿! 스트레칭" },
  { icon: "💰", text: "오늘 하루 무지출" },
  { icon: "💬", text: "따뜻한 칭찬 한마디" },
  { icon: "☁️", text: "멍하니 하늘 보기" },
  { icon: "🍩", text: "밤 10시 이후 야식금지" },
  { icon: "🏃‍♂️", text: "엘베 대신 계단 이용" },
  { icon: "📚", text: "독서 10페이지" },
  { icon: "🍎", text: "설탕 대신 과일 먹기" },
  { icon: "🛌", text: "자정 전에 잠들기" },
  { icon: "🧼", text: "내 방 10분 청소" },
  { icon: "📝", text: "오늘의 감사 일기" },
  { icon: "🌞", text: "아침 기지개 쭉쭉!" },
  { icon: "📵", text: "스마트폰 잠시 안녕" },
  { icon: "💪", text: "스쿼트 30개 도전" },
  { icon: "🥦", text: "신선한 채소 먹기" },
  { icon: "🎵", text: "마음 편한 명상 음악" },
  { icon: "🌱", text: "반려동물/식물 돌보기" },
  { icon: "🧹", text: "책상 위 1분 정리" },
  { icon: "🥗", text: "건강한 한 끼 식사" },
  { icon: "💡", text: "내일의 할 일 3가지" },
  { icon: "🧼", text: "손 뽀득뽀득 씻기" },
  { icon: "🪞", text: "거울 보고 활짝 웃기" }
];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function BingoPage() {
  const router = useRouter();
  const [dailyMissions, setDailyMissions] = useState<{ icon: string, text: string }[]>([]);
  const [cellStates, setCellStates] = useState<boolean[]>(new Array(9).fill(false));
  const [pageState, setPageState] = useState<'main' | 'loading' | 'result' | 'loading_ad'>('main');
  const [isSharing, setIsSharing] = useState(false);
  const [chanceUsed, setChanceUsed] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedDataStr = localStorage.getItem('bingoState');
    let initialized = false;

    if (savedDataStr) {
      try {
        const savedData = JSON.parse(savedDataStr);
        if (savedData.date === today && savedData.states && savedData.missions) {
          setDailyMissions(savedData.missions);
          setCellStates(savedData.states);
          setChanceUsed(savedData.chanceUsed || false);
          initialized = true;
        }
      } catch (e) { /* ignore */ }
    }

    if (!initialized) {
      // Pick 9 random missions and shuffle their positions
      const shuffledPool = [...missionPool].sort(() => 0.5 - Math.random());
      const selectedMissions = shuffledPool.slice(0, 9);
      // Final shuffle to ensure positions are also random within the 3x3 grid
      const finalMissions = [...selectedMissions].sort(() => 0.5 - Math.random());

      setDailyMissions(finalMissions);
      setCellStates(new Array(9).fill(false));
      setChanceUsed(false);

      localStorage.setItem('bingoState', JSON.stringify({
        date: today,
        missions: finalMissions,
        states: new Array(9).fill(false),
        chanceUsed: false
      }));
    }
  }, []);
  const [friends, setFriends] = useState([
    { id: 'user_1', name: '김토스', lines: 3, poked: false },
    { id: 'user_2', name: '이뱅크', lines: 2, poked: false },
    { id: 'user_3', name: '박테크', lines: 0, poked: false },
  ]);

  const achievedCombos = winningCombinations.filter(combo =>
    cellStates[combo[0]] && cellStates[combo[1]] && cellStates[combo[2]]
  );
  const lines = achievedCombos.length;
  const winningCellIndices = new Set(achievedCombos.flat());

  const prevLinesRef = useRef(0);
  const resultCardRef = useRef<HTMLDivElement>(null);
  // Track which combos are 'new' (should play animation) vs 'old' (should be static)
  const prevAchievedComboKeysRef = useRef<Set<string>>(new Set());
  const [newlyAnimatedComboKeys, setNewlyAnimatedComboKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentKeys = new Set(achievedCombos.map(c => c.join(',')));
    const brandNewKeys = new Set<string>();
    currentKeys.forEach(key => {
      if (!prevAchievedComboKeysRef.current.has(key)) {
        brandNewKeys.add(key);
      }
    });

    if (brandNewKeys.size > 0) {
      // Play confetti only for new combos
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 100
      });
      setNewlyAnimatedComboKeys(brandNewKeys);
      // After animation duration, clear the 'new' set so they become static
      const timer = setTimeout(() => {
        setNewlyAnimatedComboKeys(new Set());
      }, 1000);
      prevAchievedComboKeysRef.current = currentKeys;
      prevLinesRef.current = lines;
      return () => clearTimeout(timer);
    }
    prevAchievedComboKeysRef.current = currentKeys;
    prevLinesRef.current = lines;
  }, [lines, achievedCombos]);

  const toggleCell = (index: number) => {
    setCellStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];

      if (newStates[index] && typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }

      const today = new Date().toLocaleDateString();
      localStorage.setItem('bingoState', JSON.stringify({
        date: today,
        missions: dailyMissions,
        states: newStates,
        chanceUsed: chanceUsed
      }));

      return newStates;
    });
  };

  const handleChance = () => {
    if (chanceUsed) return;
    setPageState('loading_ad');

    // 모의 보상 획득 대기 (2초)
    setTimeout(() => {
      const uncompletedIndices = cellStates.map((s, i) => s ? null : i).filter(i => i !== null);
      if (uncompletedIndices.length > 0) {
        // 남은 빈 칸 중 무작위 1개 선택
        const randomIndex = uncompletedIndices[Math.floor(Math.random() * uncompletedIndices.length)];

        setCellStates(prev => {
          const newStates = [...prev];
          newStates[randomIndex!] = true;

          if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate([30, 50, 30]); // 보상 획득 진동 패턴
          }

          const today = new Date().toLocaleDateString();
          localStorage.setItem('bingoState', JSON.stringify({
            date: today,
            missions: dailyMissions,
            states: newStates,
            chanceUsed: true
          }));

          return newStates;
        });
        setChanceUsed(true);
      }
      setPageState('main');
    }, 2000);
  };

  const handlePoke = async (id: string, name: string) => {
    // Optimistic UI update
    setFriends(prev => prev.map(f => f.id === id ? { ...f, poked: true } : f));

    // Call the mTLS push trigger API
    try {
      await fetch('/api/push/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: id,
          title: "갓생 빙고 알림",
          content: `친구가 당신을 콕 찔렀어요! 지금 빙고를 확인해보세요.`
        })
      });
    } catch (err) {
      console.error("Push reservation failed:", err);
    }
  };

  const handleCheckResult = () => {
    setPageState('loading');

    // Trigger Push Notification (mTLS Backend)
    fetch('/api/push/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "오늘의 갓생 생존 빙고",
        message: "내일도 도장 찍으러 오세요! 🏃‍♀️🏃‍♂️"
      })
    }).catch(err => console.error("Push reservation failed:", err));

    setTimeout(() => {
      setPageState('result');
      if (lines > 0) {
        triggerConfetti();
      }
    }, 3000);
  };

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3182F6', '#F04452', '#00C853', '#FFC107'],
        zIndex: 100
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3182F6', '#F04452', '#00C853', '#FFC107'],
        zIndex: 100
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const getRewardProps = (lines: number) => {
    if (lines >= 5) return { badge: "👑", title: "루틴 마스터", desc: "당신의 갓생력은 상위 1% 타노스급입니다!" };
    if (lines >= 3) return { badge: "🔥", title: "열정 만수르", desc: "이 기세라면 올해 목표 달성은 시간문제!" };
    if (lines >= 1) return { badge: "✨", title: "눈부신 성취", desc: "천리길도 한 걸음부터! 멋진 하루를 완성했어요." };
    return { badge: "🌱", title: "도전 시작", desc: "소소한 시작이 완벽한 하루를 만듭니다." };
  };

  const handleCaptureAndShare = async () => {
    if (!resultCardRef.current || isSharing) return;
    setIsSharing(true);
    try {
      const canvas = await toCanvas(resultCardRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsSharing(false);
          return;
        }
        const file = new File([blob], 'godsaeng_bingo.png', { type: 'image/png' });

        if (navigator.share) {
          try {
            await navigator.share({
              title: '오늘의 갓생 생존 빙고',
              text: '내 갓생력은 과연? 빙고 결과를 확인해보세요! 🔥',
              files: [file]
            });
          } catch (error) {
            console.error('Share failed', error);
          }
        } else {
          // Fallback download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'godsaeng_bingo.png';
          a.click();
        }
        setIsSharing(false);
      });
    } catch (err) {
      console.error('Capture failed', err);
      alert('이미지 생성에 실패했습니다.');
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto relative antialiased" style={{ backgroundColor: '#F2F4F6', color: '#191F28' }}>

      {/* 1. Main Screen */}
      {pageState === 'main' && (
        <div className="flex flex-col flex-1 p-5 animate-in fade-in duration-300">
          <h1 className="text-2xl font-bold mb-2 text-[#191F28]">오늘의 갓생 생존 빙고 🔥</h1>
          <p className="text-[15px] text-[#8B95A1] mb-8">당신의 꾸준함이 위대한 변화를 만듭니다</p>

          <div className="relative mb-8">
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {dailyMissions.map((mission, idx) => {
                const isWinning = winningCellIndices.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCell(idx)}
                    className={`
                    relative flex flex-col items-center justify-center p-2 text-center
                    rounded-2xl aspect-square cursor-pointer break-keep
                    transition-all duration-300 select-none
                    ${isWinning
                        ? 'bg-[#B2D1FF] text-[#0059E3] border-[6px] border-[#3182F6] shadow-[0_8px_24px_rgba(49,130,246,0.4)] animate-winner-pulse z-10'
                        : cellStates[idx]
                          ? 'bg-[#E8F3FF] text-[#3182F6] border-[6px] border-[#3182F6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                          : 'bg-white text-[#191F28] border-2 border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}
                    active:scale-95
                  `}
                  >
                    <span className="text-2xl mb-1">{mission.icon}</span>
                    <span className="text-[13px] font-semibold leading-tight break-keep">{mission.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Floating BINGO! Text Effect for each achieved combo */}
            {achievedCombos.map((combo) => {
              const comboKey = combo.join(',');
              const centerIdx = combo[1];
              const row = Math.floor(centerIdx / 3);
              const col = centerIdx % 3;
              const comboIndex = winningCombinations.indexOf(combo);

              const isRow = [0, 1, 2].includes(comboIndex);
              const isCol = [3, 4, 5].includes(comboIndex);
              const isDiagonal1 = comboIndex === 6; // 0,4,8
              const isDiagonal2 = comboIndex === 7; // 2,4,6

              // Only apply pop-in animation for newly completed combos
              const isNew = newlyAnimatedComboKeys.has(comboKey);

              // --- Column (vertical) bingo: render with writing-mode ---
              if (isCol) {
                return (
                  <div
                    key={`bingo-text-${comboKey}`}
                    className={`absolute z-30 pointer-events-none select-none font-black italic text-[#3182F6] text-4xl drop-shadow-[0_4px_12px_rgba(49,130,246,0.6)] ${isNew ? 'animate-bingo-text-vertical' : ''} flex items-center justify-center tracking-tight`}
                    style={{
                      top: '50%',
                      left: `${col * 33.33 + 16.66}%`,
                      transform: 'translate(-50%, -50%)',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      height: '95%',
                      WebkitTextStroke: '2px white'
                    }}
                  >
                    BINGO!
                  </div>
                );
              }

              // --- Horizontal / Diagonal bingo ---
              let animationStyle: React.CSSProperties = {
                top: `${row * 33.33 + 16.66}%`,
                left: `${col * 33.33 + 16.66}%`,
              };

              if (isRow) {
                animationStyle = { top: `${row * 33.33 + 16.66}%`, left: '50%', width: '100%' };
              } else if (isDiagonal1) {
                animationStyle = { top: '50%', left: '50%', width: '140%' };
              } else if (isDiagonal2) {
                animationStyle = { top: '50%', left: '50%', width: '140%' };
              }

              const diagonalRotate = isDiagonal1 ? 'rotate(40deg)' : isDiagonal2 ? 'rotate(-40deg)' : 'rotate(-5deg)';

              return (
                <div
                  key={`bingo-text-${comboKey}`}
                  className={`absolute z-30 pointer-events-none select-none font-black italic text-[#3182F6] text-5xl sm:text-6xl drop-shadow-[0_4px_12px_rgba(49,130,246,0.6)] ${isNew ? 'animate-bingo-text' : ''} flex items-center justify-center whitespace-nowrap tracking-tighter`}
                  style={{
                    ...animationStyle,
                    transform: `translate(-50%, -50%) ${diagonalRotate}`,
                    WebkitTextStroke: '2px white'
                  }}
                >
                  BINGO!
                </div>
              );
            })}
          </div>

          <div className="mt-auto pb-6 flex flex-col gap-3">
            {!chanceUsed && cellStates.filter(Boolean).length < 9 && (
              <button
                onClick={handleChance}
                className="w-full py-4 rounded-2xl font-semibold text-lg bg-[#FFF2F6] text-[#F04452] active:bg-[#FFE5EA] transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">✨</span> 무료 도장 1개 받기
              </button>
            )}
            <button
              onClick={handleCheckResult}
              disabled={lines === 0}
              className={`
                w-full py-4 rounded-2xl font-semibold text-lg transition-all
                ${lines > 0 ? 'bg-[#3182F6] text-white active:bg-[#1b64da]' : 'bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed'}
              `}
            >
              빙고 결과 확인하기
            </button>
            <div className="w-full h-[60px] bg-[#E5E8EB] flex items-center justify-center text-[#8B95A1] text-sm font-medium rounded-2xl mt-4">
              <div className="absolute hidden">(AOS/iOS 배너 광고 ID 주입 위치)</div>
              하단 배너 광고 영역
            </div>

            {/* Social Ranking Area */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-bold text-[#191F28] mb-4">🏆 내 친구 랭킹</h2>
              <div className="space-y-3">
                {friends.map((friend, idx) => (
                  <div key={friend.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#F2F4F6]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F3FF] text-[#3182F6] rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#191F28]">{friend.name}</p>
                        <p className="text-xs text-[#8B95A1]">{friend.lines}줄 달성</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePoke(friend.id, friend.name)}
                      disabled={friend.poked}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${friend.poked ? 'bg-[#F2F4F6] text-[#8B95A1]' : 'bg-[#E8F3FF] text-[#3182F6] active:bg-[#D0E4FF]'}`}
                    >
                      {friend.poked ? '콕 찔렀어요' : '콕 찌르기'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Loading Screen (Interstitial Ad) */}
      {pageState === 'loading' && (
        <div className="flex flex-col flex-1 p-5 animate-in fade-in duration-300 pt-8">
          <div className="w-full h-[250px] bg-[#E5E8EB] rounded-2xl flex items-center justify-center text-[#8B95A1] text-sm font-medium mb-8">
            <div className="absolute hidden">(AOS/iOS 전면 광고 ID 주입 위치)</div>
            전면 배너 광고 영역
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#E5E8EB] border-t-[#3182F6] rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-semibold text-[#191F28] text-center leading-relaxed">
              오늘의 갓생 리포트를<br />만들고 있어요
            </p>
          </div>
        </div>
      )}

      {/* 3. Result / Share Screen */}
      {pageState === 'result' && (
        <div className="flex flex-col flex-1 p-5 animate-in fade-in duration-300 overflow-y-auto">
          {/* Photocard UI */}
          <div ref={resultCardRef} className="bg-gradient-to-br from-[#FFFFFF] to-[#F8F9FA] rounded-[24px] p-8 pb-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col items-center mb-6 border border-white/80 relative overflow-hidden">
            {/* 띠지 효과 데코레이션 */}
            {lines > 0 && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3182F6]/20 to-transparent -rotate-45 -translate-y-16 translate-x-16 pointer-events-none"></div>
            )}

            <div className="text-6xl mb-4 animate-bounce-icon filter drop-shadow-sm z-10">{getRewardProps(lines).badge}</div>
            <h1 className="text-center text-[26px] font-extrabold mb-3 tracking-tight text-[#191F28] z-10 break-keep">
              {lines > 0 ? (
                <>
                  <span className="text-[#3182F6] text-[17px] font-bold block mb-1.5 tracking-normal">{lines}줄 빙고 완성</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#191F28] to-[#4E5968]">{getRewardProps(lines).title}</span> 🎉
                </>
              ) : (
                <>
                  <span className="text-[#8B95A1] text-[17px] font-bold block mb-1.5 tracking-normal">내일은 더 잘할 수 있어요</span>
                  <span className="text-[#4E5968]">{getRewardProps(lines).title}</span> 🌱
                </>
              )}
            </h1>
            <p className="text-[15px] font-medium text-[#505967] text-center mb-8 break-keep leading-relaxed z-10 px-2">
              {getRewardProps(lines).desc}
            </p>

            <div className="bg-[#F2F4F6] p-4 rounded-2xl w-[220px] shadow-inner z-10 border border-gray-100">
              <div className="grid grid-cols-3 gap-2">
                {cellStates.map((state, idx) => {
                  const isWinning = winningCellIndices.has(idx);
                  return (
                    <div key={idx} className={`aspect-square rounded-lg flex items-center justify-center relative ${isWinning ? 'bg-[#F0F6FF] border-[3px] border-[#3182F6]' : state ? 'bg-[#E8F3FF] border-[3px] border-[#3182F6]/50' : 'bg-white'}`}>
                      <span className={`text-[18px] ${state ? 'opacity-100' : 'opacity-20 grayscale'}`}>{dailyMissions[idx].icon}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto pb-6 flex flex-col gap-3">
            <button
              onClick={handleCaptureAndShare}
              disabled={isSharing}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${isSharing ? 'bg-[#E5E8EB] text-[#8B95A1]' : 'bg-[#FEE500] text-black active:scale-[0.98]'}`}
            >
              {isSharing ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#8B95A1] border-t-transparent rounded-full animate-spin"></div>
                  공유 이미지를 만들고 있어요...
                </>
              ) : (
                "빙고 결과 이미지로 공유하기"
              )}
            </button>
            <button
              onClick={() => { setCellStates(new Array(9).fill(false)); setPageState('main'); }}
              className="w-full py-4 rounded-2xl font-semibold text-lg bg-white text-[#191F28] active:scale-[0.98] transition-all border border-[#E5E8EB]"
            >
              내일 또 하러 오기
            </button>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes stampAnim {
          0% { opacity: 0; transform: scale(3) rotate(-15deg); }
          50% { opacity: 1; transform: scale(0.9) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .animate-bounce-stamp {
          animation: stampAnim 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-icon {
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes winnerPulse {
          0% { transform: scale(1); box-shadow: 0 4px 16px rgba(49,130,246,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(49,130,246,0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 16px rgba(49,130,246,0.3); }
        }
        .animate-winner-pulse {
          animation: winnerPulse 1.5s ease-in-out infinite;
        }
        @keyframes bingoTextPop {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-20deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4) rotate(10deg); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(1) rotate(-10deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-10deg); opacity: 1; }
        }
        .animate-bingo-text {
          animation: bingoTextPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes bingoTextPopVertical {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(0.95); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .animate-bingo-text-vertical {
          animation: bingoTextPopVertical 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />
    </div>
  );
}
