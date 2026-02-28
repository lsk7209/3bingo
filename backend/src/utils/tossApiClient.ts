import fs from 'fs';
import https from 'https';
import axios from 'axios';
import path from 'path';

/**
 * 앱인토스 전용 mTLS 클라이언트 (Axios Wrapper)
 * 토스 API 호출 시에만 사용해야 합니다.
 */

// 개발용 더미 처리 방지 및 실제 경로 유도를 위한 환경변수
const CERT_PATH = process.env.MTLS_CERT_PATH || path.resolve(__dirname, '../../certs/toss_cert.pem');
const KEY_PATH = process.env.MTLS_KEY_PATH || path.resolve(__dirname, '../../certs/toss_key.pem');

let httpsAgent;

try {
    // 앱인토스 심사 필수 사항: mTLS 통신
    httpsAgent = new https.Agent({
        cert: fs.readFileSync(CERT_PATH),
        key: fs.readFileSync(KEY_PATH),
        rejectUnauthorized: process.env.NODE_ENV === 'production', // 운영 환경: TLS 인증서 검증 강제
    });
    console.log('[mTLS] 토스 인증서 로드 성공');
} catch (err) {
    const error = err as Error;
    console.warn('[mTLS WARNING] 토스 인증서를 찾을 수 없습니다. (초기 세팅 시 무시 가능)', error.message);
    // 에러 발생 시 더미 에이전트로 폴백 (테스트 환경)
    httpsAgent = new https.Agent({ rejectUnauthorized: false });
}

export const tossApiClient = axios.create({
    baseURL: 'https://api.toss.im',
    httpsAgent,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor for Error Logging & Self-Healing Triggers
tossApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(`[TOSS API ERROR] ${error.response?.status} - ${error.message}`);
        // 필요한 경우 재시도 늪지(Retry Login) 추가 구현
        return Promise.reject(error);
    }
);
