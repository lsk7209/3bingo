import { NextResponse } from 'next/server';
import { tossApiClient } from '@/utils/tossApiClient';

export async function POST(request: Request) {
    // 타사 로그인 (Google, Kakao 등) 절대 금지. 오직 토스 로그인만 허용
    try {
        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ success: false, error: "code 파라미터가 필요합니다." }, { status: 400 });
        }

        // mTLS 통신을 통한 실제 토큰 발급 예시
        // 환경 변수가 등록되지 않은 경우엔 tossApiClient 내부에서 Mock 응답을 반환합니다.
        const res = await tossApiClient('/v1/oauth/token', {
            method: 'POST',
            body: JSON.stringify({
                grant_type: "authorization_code",
                code,
                client_id: process.env.TOSS_CLIENT_ID || 'test_client_id'
            })
        });

        // 실제 성공 시 DB 갱신 및 토큰 저장 로직이 필요
        return NextResponse.json({
            success: true,
            message: "토스 로그인 인증 및 세션 발급을 처리했습니다.",
            data: res
        });
    } catch (error) {
        console.error("Auth Route Error:", error);
        return NextResponse.json({ success: false, error: "토스 로그인 처리 중 오류 발생" }, { status: 500 });
    }
}
