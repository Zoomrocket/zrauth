export interface IAuthService {

    // creates an account
    createAccount(email: string, password: string, firstname: string, lastname: string, organization: string): Promise<boolean>

    // sign in with email id
    loginWithEmail(email: string, password: string): Promise<{ access_token: string, refresh_token: string }>

    // generate google oauth callback url
    generateGoogleSignInURL(): { url: string }

    // login with google from the code generated from redirect url
    loginWithGoogle(code: string): Promise<{ access_token: string, refresh_token: string }>

    // obtain refresh token and return new access token
    refreshAccessToken(refreshToken: string): Promise<{ access_token: string, refresh_token: string }>

}
