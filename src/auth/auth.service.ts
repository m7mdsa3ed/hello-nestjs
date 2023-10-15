import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string, rememberMe: boolean = true): Promise<any> {
    const user = await this.usersService.findOnByEmail(email);

    if (user?.password !== pass) {
      throw new UnauthorizedException;
    }

    return {
      accessToken: await this.generateAccessTokenResponse(user, rememberMe)
    };
  }

  async generateAccessTokenResponse(user: User, rememberMe: boolean): Promise<string> {
    const payload = {
      sub: user.id,
      user
    };

    const signOptions = {};

    if (!rememberMe) {
      signOptions["expiresIn"] = '30d';
    }

    return this.jwtService.sign(payload, signOptions);
  }
}
