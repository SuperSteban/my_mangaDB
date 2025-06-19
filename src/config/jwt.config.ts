import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authConfig from './auth.config';

dotenv.config();


export const generateToken = (payload: object, expiresIn:object = { expiresIn: authConfig.secret_expires_in as any }): any => {
  return jwt.sign(payload, authConfig.secret as any, expiresIn);
}

export const refreshToken = (payload:object, expiresIn:object = { expiresIn: authConfig.refresh_secret_expires_in as any } ): any =>{
  return jwt.sign(payload, authConfig.refresh_secret as string, expiresIn);
}
