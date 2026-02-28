import { Router, Request, Response } from 'express';
import { tossApiClient } from '../utils/tossApiClient';

const router = Router();

// POST /api/auth/toss
// 앱인토스 SDK가 전달한 인가 코드(code)를 받아 토스 OAuth 서버에서 액세스 토큰을 발급
router.post('/toss', async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, error: '토스 인가 코드가 필요합니다.' });
        }

        // [의무] mTLS 연동을 통한 OAuth 토큰 발급
        // 실제 운영 환경에서 아래 주석을 해제하고 토스 디벨로퍼스에서 발급받은
        // client_id / client_secret을 .env에 등록하세요.
        /*
        const tokenResponse = await tossApiClient.post('/v1/oauth/token', {
            grant_type: 'authorization_code',
            code,
            client_id: process.env.TOSS_CLIENT_ID,
            client_secret: process.env.TOSS_SECRET_KEY,
        });
        const { access_token, refresh_token } = tokenResponse.data;
        return res.json({ success: true, access_token, refresh_token });
        */

        // ─── 개발/보일러플레이트 Mock 응답 ─────────────────────────────────────
        // TODO: 위 실제 tossApiClient 호출로 교체 후 이 블록 삭제
        void tossApiClient; // lint 억제 (실제 연동 전까지 임시)
        res.json({ success: true, message: '토스 로그인 성공 (Mock — 실제 연동 전)' });
    } catch (error) {
        console.error('[Auth] Toss Login Error:', error);
        res.status(500).json({ success: false, error: '토스 로그인 처리 중 서버 오류가 발생했습니다.' });
    }
});

export default router;
