import { NextResponse } from 'next/server';
// import { tossApiClient } from '@/utils/tossApiClient';

export async function POST(request: Request) {
    // 타사 로그인 (Google, Kakao 등) 절대 금지. 오직 토스 로그인만 허용
    try {
        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ success: false, error: "code 파라미터가 필요합니다." }, { status: 400 });
        }

        // 토큰 발급 로직 예시 (mTLS 필수)
        // const res = await tossApiClient('/v1/oauth/token', { 
        //   method: 'POST', 
        //   body: JSON.stringify({ 
        //     grant_type: "authorization_code",
        //     code, 
        //     client_id: process.env.TOSS_CLIENT_ID
        //   }) 
        // });

        return NextResponse.json({
            success: true,
            message: "토스 로그인 성공 및 세션 발급 완료 (Mock)"
        });
    } catch (error) {
        console.error("Auth Route Error:", error);
        return NextResponse.json({ success: false, error: "토스 로그인 처리 중 오류 발생" }, { status: 500 });
    }
}
