import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = this.getTokenFromRequest(request);

      request["user"] = await this.parseToken(token);
    } catch {
      throw new UnauthorizedException;
    }

    return true;
  }

  private getTokenFromRequest(request: Request): string | undefined {
    const headers = request.headers;

    if (!headers["authorization"]) {
      throw new UnauthorizedException;
    }

    const [type, token] = headers["authorization"].split(" ") ?? [];

    if (type !== "Bearer") {
      throw new UnauthorizedException;
    }

    return token;
  }

  private async parseToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: "SECRET"
      });
    } catch {
      throw new UnauthorizedException;
    }
  }
}