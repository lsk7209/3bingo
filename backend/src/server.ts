import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import paymentRouter from './routes/payment';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 8080;

// ─── CORS: 토스 미니앱 허용 Origin만 명시 (와일드카드 금지) ─────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://miniapp.toss.im').split(',');
app.use(cors({
    origin: (origin, callback) => {
        // origin이 없는 경우(서버 간 통신, curl 등)는 개발 편의상 허용
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS 정책 위반: 허용되지 않은 Origin — ${origin}`));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// 헬스체크
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 토스 앱인토스 특화 라우터
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);

app.listen(PORT, () => {
    console.log(`[Backend] TOSS Boilerplate server listening on port ${PORT}`);
});
