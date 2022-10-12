import bodyParser from 'body-parser';
import express from 'express';
import { customLogger, WinstonLevel } from './logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen({ port: 8080 }, () => {
	customLogger(WinstonLevel.INFO, 'Running on port 8080');
});
