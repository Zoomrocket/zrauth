import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { keys } from "src/keys";
import { LoginEmailDto, LoginGoogleDto, SignupDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("/v1/auth")
export class AuthController {
    constructor(
        private readonly _authService: AuthService
    ) { }

    @Post("/signup")
    async postSignup(@Body() body: SignupDto, @Res() res: Response) {
        try {
            await this._authService.createAccount(body.email, body.password, body.firstname, body.lastname, body.organization);
            return { detail: "created" };
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            return;
        }
    }

    @Post("/login")
    async postLogin(@Body() body: LoginEmailDto, @Res() res: Response) {
        try {
            let result = await this._authService.loginWithEmail(body.email, body.password);
            return result;
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            return;
        }
    }

    @Get("/login-google-url")
    getGoogleURL(@Res() res: Response) {
        try {
            let result = this._authService.generateGoogleSignInURL();
            return result;
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            return;
        }
    }



    @Post("/login-google-redirect")
    async postLoginGoogle(@Body() body: LoginGoogleDto, @Res() res: Response) {
        try {
            let result = await this._authService.loginWithGoogle(body.code);
            res.redirect(`${keys.REDIRECT_URL}?access_token=${result.accessToken}&refresh_token=${result.refreshToken}`);
            return;
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            return;
        }
    }

}
