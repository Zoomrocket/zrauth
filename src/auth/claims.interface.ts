export interface AccessTokenClaims {
  typ: string;
  jti: string;
  iss: string;
  scope: string;
  user_id: string;
  email: string;
  profile_data: any;
  organizations: Array<{
    organization_id: string;
    identifier: string;
    name: string;
    roles: Array<string>;
  }>;
}

export interface RefreshTokenClaims {
  typ: string;
  jti: string;
  iss: string;
  scope: string;
  user_id: string;
}
