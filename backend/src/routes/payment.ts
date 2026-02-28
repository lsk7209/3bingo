import { Router, Request, Response } from 'express';
import { tossApiClient } from '../utils/tossApiClient';

const router = Router();

// POST /api/payment/confirm
// 클라이언트로부터 paymentKey, orderId, amount를 받아 토스페이먼츠 결제 승인 요청
router.post('/confirm', async (req: Request, res: Response) => {
    try {
        const { paymentKey, orderId, amount } = req.body;

        if (!paymentKey || !orderId || !amount) {
            return res.status(400).json({ success: false, error: '잘못된 결제 승인 요청입니다. (paymentKey, orderId, amount 필수)' });
        }

        // [의무] 토스페이먼츠 결제 승인 mTLS 호출
        // 실제 운영 환경에서 아래 주석을 해제하세요.
        // 토스 디벨로퍼스 > 토스페이먼츠 > Secret Key를 .env의 TOSS_SECRET_KEY에 등록 필요.
        /*
        const encryptedKey = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64');
        const confirmResponse = await tossApiClient.post('/v1/payments/confirm', {
            paymentKey,
            orderId,
            amount,
        }, {
            headers: { Authorization: `Basic ${encryptedKey}` },
        });
        return res.json({ success: true, data: confirmResponse.data });
        */

        // ─── 개발/보일러플레이트 Mock 응답 ─────────────────────────────────────
        void tossApiClient; // lint 억제 (실제 연동 전까지 임시)
        res.json({ success: true, message: '토스페이 컨펌 성공 (Mock — 실제 연동 전)', orderId, amount });
    } catch (error) {
        console.error('[Payment] Confirm Error:', error);
        res.status(500).json({ success: false, error: '결제 승인 과정에서 서버 오류가 발생했습니다.' });
    }
});

export default router;
