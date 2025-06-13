import { generateToken, refreshToken } from "../config/jwt.config";
import db from "../db"
import bcrypt from 'bcryptjs';

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
    try {
      db.none('UPDATE users SET refresh_token = $2 WHERE email = $1', [email, refresh])
      const valid = await db.one(`select created_at + INTERVAL $2 AS "expired_at" from users where email=$1`, [email, '24 hours']);
      db.none('UPDATE users SET token_valid_until = $1 WHERE email = $2', [valid.expired_at, email]);
    } catch (error) {
      console.log(`>> Error Refresh: ${error}`)

    }

    return { user: newUser, access_token: jwtToken, refresh_token: refresh };

  }

  static async login(email: string, password: string) {
    const user = await db.oneOrNone(
      'SELECT * FROM users WHERE email = $1',
      [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const jwtToken = generateToken({ id: user.id });
    const refresh = refreshToken({ id: user.id });
    try {
      db.oneOrNone('UPDATE users SET refresh_token = $2 WHERE email = $1', [
        email,
        refresh
      ])
      const valid = await db.one(`select created_at + INTERVAL $2 AS "expired_at" FROM users where email=$1`, [email, '24 hours']);
      db.none('UPDATE users SET token_valid_until = $1 WHERE email = $2', [valid.expired_at, email]);

    } catch (error) {
      throw new Error('Something went wrong, Invalid Session');
    }
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        birth_date: user.birth_date,
        avatar: user.avatar,
        pronouns: user.pronouns,
      },
      accessToken: jwtToken, refreshToken: refresh
    };
  };

  static async logout(userId: number) {
    try {
      db.oneOrNone('UPDATE users SET refresh_token = NULL WHERE id = $1', [
        userId,
      ])
    }catch(error) {
      throw Error(`>>error logout ${error}`)
    }
  }

  static async isRevoked(userID: number){
    try {
      const user = db.oneOrNone('SELECT refresh_token from users WHERE id = $1', [userID]); 
      return user
    } catch (error) {
      console.log(error)
    }
  }
}
export default AuthService;