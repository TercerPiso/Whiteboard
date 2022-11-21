export class TokenData {
  token: string;
  expiration: number;
  sessionType: SessionType;
}

export enum SessionType {
  LOGIN,
  SIGNUP,
}
