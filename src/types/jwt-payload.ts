export interface JwtPayload {
  id: string;
  email: string;
  sessionStart?: number | undefined;
  roleId?: string | undefined;
  roleName?: string | null | undefined;
  iat?: number;
  exp?: number;
}
