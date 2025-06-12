import { strict } from "assert";
import { generateToken, refreshToken } from "../controllers/config/jwt.config";
import db from "../db"
import bcrypt from 'bcryptjs';
import { string } from "zod";

class AuthService {
  static async register(username: string, email: string, password: string) {
    const userExists = await db.oneOrNone('SELECT COUNT(id) FROM users WHERE email = $1', [email]);
    if (userExists > 0) {
      throw new Error('user already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.one(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    ).catch((err: string) => {
      console.log(`>>Error ${err}`)
    });
    const jwtToken = generateToken({ userId: newUser.id });
    const refresh = refreshToken({ userId: newUser.id });
    db.result('UPDATE users SET refresh_token = $2 WHERE email = $1', [email, refresh])
      .catch((err: string) => {
        console.log(`>> Error Refresh: ${err}`)
      });

    return { user: newUser, access_token: jwtToken, refresh_token: refresh };

  }

  static async login(emailOrUsername: string, password: string) {
    const user = await db.oneOrNone(
      'SELECT * FROM users WHERE email = $1 OR users WHERE username = $1',
      [emailOrUsername]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const jwtToken = generateToken({ id: user.id });
    const refresh = refreshToken({ id: user.id });

    db.oneOrNone('UPDATE FROM users WHERE email = $1 SET refresh_token = $2', [
      emailOrUsername,
      refresh
    ]).catch((err: string) => {
      throw new Error(`>> Error Refresh: ${err} `)
    })

    return { user: user, accessToken: jwtToken, refreshToken: refresh };
  };
}
export default AuthService;