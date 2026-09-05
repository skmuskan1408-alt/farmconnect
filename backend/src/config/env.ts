import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'farmconnect_super_secret_jwt_key_sih2026_998877';
export const NODE_ENV = process.env.NODE_ENV || 'development';
