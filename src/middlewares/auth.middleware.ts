import { Request, Response, NextFunction } from "express";
import { Jwt } from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JTW_SECRET || 'def';
