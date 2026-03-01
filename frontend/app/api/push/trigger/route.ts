import { NextResponse } from 'next/server';
import { tossApiClient } from '@/utils/tossApiClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { targetUserId, title, content } = body;

        if (!targetUserId) {
            return NextResponse.json({ success: false, error: "targetUserId 파라미터가 필요합니다." }, { status: 400 });
        }

        // mTLS 통신을 통한 실제 토스 친구 푸시 발송 예시
        // 환경 변수가 등록되지 않은 경우엔 tossApiClient 내부에서 Mock 응답을 반환합니다.
        const res = await tossApiClient(`/v1/push/send`, {
            method: 'POST',
            body: JSON.stringify({
                user_id: targetUserId,
                title: title || "갓생 빙고알림",
                content: content || "친구가 빙고에서 당신을 찔렀습니다!",
                client_id: process.env.TOSS_CLIENT_ID || 'test_client_id'
            })
        });

        return NextResponse.json({
            success: true,
            message: "푸시(찌르기) 알림 발송 성공",
            data: res
        });
    } catch (error) {
        console.error("Push Trigger Error:", error);
        return NextResponse.json({ success: false, error: "푸시 알림 발송 중 오류 발생" }, { status: 500 });
    }
}
