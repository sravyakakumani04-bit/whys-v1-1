import { ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DbService } from '../db/db.service'; // your existing pg wrapper
import { SignupDto } from './dto/signup.dto';

type PublicUser = {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwt: JwtService
  ) {}

  async signup(dto: SignupDto): Promise<PublicUser> {
    // 1) preflight duplicate check (case-insensitive)
    const dup = await this.db.query<{ which: 'email' | 'username' }>(
      `
      SELECT CASE
               WHEN LOWER(email) = LOWER($1) THEN 'email'
               WHEN LOWER(username) = LOWER($2) THEN 'username'
             END as which
      FROM users
      WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)
      LIMIT 1;
      `,
      [dto.email, dto.username],
    );
    if (dup.rowCount) {
      throw new ConflictException(
        dup.rows[0].which === 'email' ? 'Email already in use' : 'Username already in use',
      );
    }

    // 2) hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3) insert user
    const { rows } = await this.db.query<PublicUser>(
      `
      INSERT INTO users (first_name, last_name, username, email, password_hash)
      VALUES ($1, $2, $3, LOWER($4), $5)
      RETURNING id, email, username, first_name, last_name, created_at;
      `,
      [dto.firstName, dto.lastName, dto.username, dto.email, passwordHash],
    );

    return rows[0];
  }
async isUsernameAvailable(username: string): Promise<boolean> {
    if (!username) return false;
    const { rowCount } = await this.db.query(
      `SELECT 1 FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
      [username],
    );
    return rowCount === 0;
}

async signIn(identifier: string, password: string) {
    // lookup by email OR username
    const { rows, rowCount } = await this.db.query<any>(
      `
      SELECT id, email, username, first_name, last_name, created_at, password_hash
      FROM users
      WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
      LIMIT 1;
      `,
      [identifier],
    );

    if (!rowCount) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
    };

    // generate tokens
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync(payload, { expiresIn: '7d' });

    return { user: publicUser, accessToken, refreshToken };
  }


}
