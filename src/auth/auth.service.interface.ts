interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  // send password reset email
  sendResetCode(email: string): Promise<boolean>;

  // change password
  resetPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<boolean>;

  // creates an account
  createAccount(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    organization: string,
  ): Promise<boolean>;

  // sign in with email id
  loginWithEmail(email: string, password: string): Promise<TokenPair>;

  // generate google oauth callback url
  generateGoogleSignInURL(): { url: string };

  // login with google from the code generated from redirect url
  loginWithGoogle(code: string): Promise<TokenPair>;

  // obtain refresh token and return new access token
  refreshAccessToken(refreshToken: string): Promise<TokenPair>;
}
