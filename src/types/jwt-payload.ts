export interface JwtPayload {
  id: string;
  email: string;
  sessionStart?: number | undefined;
  roleId?: string | undefined;
  iat?: number;
  exp?: number;
}
