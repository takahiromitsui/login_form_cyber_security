import express from 'express';
import { customLogger, WinstonLevel } from './logger';
import authRoutes from './routes/auth';

const app = express();

app.use('/auth', authRoutes);

app.listen({ port: 8080 }, () => {
	customLogger(WinstonLevel.INFO, 'Running on port 8080');
});
