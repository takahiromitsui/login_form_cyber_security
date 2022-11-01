import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { customLogger, WinstonLevel } from './logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fin4zdy.mongodb.net/security`
	)
	.then(res => {
		app.listen(process.env.PORT || 8080);
		customLogger(WinstonLevel.INFO, 'Running on port 8080');
	})
	.catch(e => {
		const error = e as Error;
		customLogger(WinstonLevel.ERROR, error.message);
	});
