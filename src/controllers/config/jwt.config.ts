import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || 'default_secret';

export const generateToken = (payload: object, expiresIn:object = { expiresIn: process.env.AUTH_SECRET_EXPIRES_IN as string }): string => {
  return jwt.sign(payload, secret, expiresIn);
}

export const refreshToken = (payload:object, expiresIn:object = { expiresIn: process.env.AUTH_SECRET_EXPIRES_IN as string } ): string =>{
  return jwt.sign(payload, secret, { expiresIn:'15min'});
}
