# 📖 Apps-in-Toss Developer Guide

이 문서는 본 보일러플레이트를 사용하여 토스 미니앱을 개발하는 실무 개발자를 위한 상세 가이드입니다.

## 1. 🎨 TDS (Toss Design System) 적용
토스 미니앱 심사 통과를 위해 가장 중요한 것은 TDS 준수입니다.

- **색상**: `frontend/app/globals.css`에 정의된 TDS 컬러 토큰(`--toss-gray-*`, `--toss-blue`)만 사용하세요.
- **레이아웃**: `TopAppBar`와 `BottomTabBar`는 `layout.tsx`에서 전역 배치되어 있습니다. 개별 페이지에서는 `main` 태그의 패딩 영역 내에서 콘텐츠를 구성하세요.
- **탭바(Tab Bar)**: 하단 탭바 아이콘은 반드시 공식 SVG를 사용해야 합니다. (기존 이모지 사용 금지)
- **다크모드**: 토스 미니앱은 라이트 테마만 지원하므로 다크모드 대응 코드는 배제되어 있습니다.

## 2. 🛡️ 보안 및 mTLS 통신 (Backend)
토스 서버와 통신할 때는 반드시 mTLS 인증서를 통한 상호 인증이 필요합니다.

- **모듈**: `backend/src/utils/tossApiClient.ts`
- **사용법**: Axios 인스턴스에 인증서(`certs/`)를 로드하여 호출합니다.
- **주의**: 운영 환경에서는 반드시 `rejectUnauthorized: true`를 유지하여 서버 인증서를 검증해야 합니다.

## 3. 💰 수익화 (Monetization)
- **전면 광고**: `AdInterstitial` 컴포넌트를 사용하세요. 이 컴포넌트는 사용자가 광고를 5초 이상 시청해야만 '닫기' 버튼이 활성화되는 토스 앱 가이드라인을 이미 준수하고 있습니다.
- **결제**: `backend/src/routes/payment.ts`의 템플릿을 사용하여 토스페이먼츠 연동을 구축하세요.

## 🔑 필수 체크리스트 (심사 반려 방지)
- [ ] **Toss Login Only**: 구글/카카오 등 타사 로그인이 포함되어 있지 않은가?
- [ ] **No Custom Headers**: 헤더와 탭바가 TDS 기본 디자인과 동일한가?
- [ ] **Security Headers**: HSTS, CSP 등 보안 헤더가 적용되어 있는가? (Next.js config에 포함됨)

---
이 가이드를 준수하여 심사 통과 확률을 극대화하세요.
