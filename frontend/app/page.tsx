import TossLoginButton from './components/Auth/TossLoginButton';

export default function Home() {
  return (
    // layout.tsx에서 TopAppBar(56px) + BottomTabBar(49px+safe-area) padding 처리됨
    // 이 페이지는 남은 영역 전체를 사용
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 bg-white space-y-8">

      {/* 🚀 Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#191F28' }}>
          퍼즐 게임<br />
          <span style={{ color: '#3182F6' }}>토스 환경 테스트</span>
        </h2>
        <p className="text-[15px] leading-relaxed break-keep px-2" style={{ color: '#8B95A1' }}>
          토스 미니앱 연동 보일러플레이트입니다.<br />
          타사 로그인을 배제하고 오직 토스 전용 UI를 제공합니다.
        </p>
      </div>

      {/* 💳 Login UI Area */}
      <div
        className="w-full max-w-sm p-6 rounded-2xl border"
        style={{ backgroundColor: '#F9FAFB', borderColor: '#F2F4F6' }}
      >
        <h3 className="text-center font-bold mb-6" style={{ color: '#191F28' }}>
          로그인하여 시작하기
        </h3>
        <TossLoginButton />
      </div>

    </div>
  );
}
