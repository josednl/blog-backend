export interface JwtPayload {
  id: string;
  email: string;
  sessionStart?: number | undefined;
  iat?: number;
  exp?: number;
}
