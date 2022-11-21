import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppleSignInResponse } from './apple-login.domain';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class AppleLoginService {
  private readonly AppID = 'net.tercerpiso.whiteboard';
  private jwksClient;

  constructor(private readonly httpService: HttpService) {
    this.jwksClient = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
  }

  async validateToken(
    aps: AppleSignInResponse,
  ): Promise<{ error: boolean; payload?: jwt.JwtPayload; message?: string }> {
    const jwtRaw = jwt.decode(aps.identityToken, { complete: true });
    const kid = jwtRaw.header.kid;
    try {
      const appleKey = await this.getSigningKeys(kid);
      const payload = jwt.verify(aps.identityToken, appleKey) as jwt.JwtPayload;
      if (payload.aud !== this.AppID) {
        return { error: true, message: 'Invalid app id' };
      }
      if (payload.sub !== jwtRaw.payload.sub) {
        return { error: true, message: 'Invalid sub' };
      }
      return { error: false, payload };
    } catch (e) {
      return { error: true, message: 'Invalid jks' };
    }
  }

  async getSigningKeys(kid) {
    const key = await this.jwksClient.getSigningKey(kid);
    return key.getPublicKey();
  }
}
