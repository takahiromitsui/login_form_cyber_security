import { NextFunction, Request, Response } from 'express';
import { Send } from 'express-serve-static-core';

export interface CustomJsonType {
	message: string;
	data?: Record<string, unknown>;
}
export interface CustomResponseType extends Response {
	json: Send <CustomJsonType, this>
}

export type ExpressRouteFunc = (
	req: Request,
	res: Response,
	next?: NextFunction
) => void | Promise<void>;
