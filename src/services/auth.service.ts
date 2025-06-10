import { generateToken, refreshToken } from "utils/jwt.utils";
import db from "../db"
import bcrypt from 'bcryptjs';

class AuthService {
  static async register(email: string, password: string) {
    const userExists = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists) {
      throw new Error('user already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.one(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    ).catch(error => {
      throw new Error('something happend with the register')
    });

    const jwtToken = generateToken({ id: newUser.id, email });
    const refresh = refreshToken({ id: newUser.id, email });
    db.result('UPDATE FROM users WHERE email = $1 SET refresh = $2', [email, refresh])
      .catch(error => {
        throw new Error('The minions were went to vacation try again later')

      });

    return { user: newUser, token: jwtToken, refresh: refresh };
  }

  static async login(email: string, password: string) {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const jwtToken = generateToken({ id: user.id, email });
    const refresh = refreshToken({ id: user.id, email });


    return { user: user, accessToken: jwtToken, refreshToken: refresh };
  };
}
export default AuthService;