import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
    rememberMe: boolean = true,
  ): Promise<any> {
    const user = await this.usersService.findOnByEmail(email);

    const userPassword = this.getUserPassword(user.password);

    if (await bcrypt.compare(pass, userPassword)) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.generateAccessTokenResponse(user, rememberMe),
    };
  }

  async generateAccessTokenResponse(
    user: User,
    rememberMe: boolean,
  ): Promise<string> {
    const payload = {
      sub: user.id,
      user,
    };

    const signOptions = {};

    if (!rememberMe) {
      signOptions['expiresIn'] = '30d';
    }

    return this.jwtService.sign(payload, signOptions);
  }

  /**
   * $2a$ or $2y$ is only a prefix that indicates the version of the algorithm that's being used.
   * In 2011 there was a major bug in the PHP implementation, and there was a initiative
   * to change the original prefix $2a$ to $2x$ to indicate that the hash was done
   * with the bugged algorithm and $2y$ to indicate it was correct. No one but
   * PHP took the recommendation. That's why node.js bcrypt doesn't recognize
   * that prefix and PHP crypt_blowfish does.
   * @param password
   * @private
   */
  private getUserPassword(password: string) {
    return password.replace(/^\$2y(.+)$/i, '$2a$1');
  }
}
