import bodyParser from 'body-parser';
import express from 'express';
import { customLogger, WinstonLevel } from './logger';
import mainRoutes from './routes/main';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { handleWhitelist } from './helpers/envHandler';
dotenv.config();

const app = express();

const whitelist = handleWhitelist();

const corsOptions = {
	origin: function (origin: any, callback: any) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(mainRoutes);
app.use('/auth', cors(corsOptions), authRoutes);
app.use('/user', cors(corsOptions), userRoutes);
app.use(helmet());

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fin4zdy.mongodb.net/security`
	)
	.then(res => {
		const port = process.env.PORT || 80;
		app.listen(port);
		customLogger(WinstonLevel.INFO, `Running on port ${port}`);
	})
	.catch(e => {
		const error = e as Error;
		customLogger(WinstonLevel.ERROR, error.message);
	});
