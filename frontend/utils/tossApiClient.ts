import https from 'https';

/**
 * mTLS 통신을 위한 토스 전용 API 클라이언트
 * 토스 서버(api.toss.im)와 통신할 때는 반드시 이 함수를 통해 mTLS 인증서를 실어 보내야 합니다.
 */
export async function tossApiClient(
    path: string,
    options: { method?: string; body?: string; headers?: Record<string, string> } = {}
): Promise<any> {

    return new Promise((resolve, reject) => {
        // 실제 환경에서는 환경 변수나 보안 저장소에서 인증서(cert)와 개인키(key)를 불러옵니다.
        // TOSS_CLIENT_CERT, TOSS_CLIENT_KEY 환경 변수가 없으면 에러 발생 혹은 Mock 응답
        const cert = process.env.TOSS_CLIENT_CERT;
        const key = process.env.TOSS_CLIENT_KEY;

        // 만약 로컬 개발 환경이거나 인증서가 없는 경우, 테스트용 Mock 응답 반환
        if (!cert || !key) {
            console.warn('⚠️ [tossApiClient] mTLS 인증서(TOSS_CLIENT_CERT/KEY)가 없어 Mock 처리합니다.');
            return resolve({
                success: true,
                mocked: true,
                message: 'mTLS 통신 방식을 모의(Mock)로 성공했습니다.',
            });
        }

        const agent = new https.Agent({
            cert: cert.replace(/\\n/g, '\n'),
            key: key.replace(/\\n/g, '\n'),
            // 필요한 경우 토스에서 제공하는 ca 루트 인증서도 추가할 수 있습니다.
        });

        const requestOptions = {
            hostname: 'api.toss.im',
            port: 443,
            path: path,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            agent: agent
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Toss API Error: ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('mTLS Request Error:', error);
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}
