import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { Response } from 'express';
import {
  LoginEmailDto,
  LoginGoogleDto,
  PasswordResetDto,
  RefreshDto,
  SignupDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('/v1/auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/signup')
  async postSignup(@Body() body: SignupDto, @Res() res: Response) {
    try {
      await this._authService.createAccount(
        body.email,
        body.password,
        body.firstname,
        body.lastname,
        body.organization,
        body.organizationData
      );
      return { detail: 'created' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to signup' };
    }
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async postRefresh(@Body() body: RefreshDto, @Res() res: Response) {
    try {
      let result = await this._authService.refreshAccessToken(
        body.refresh_token,
      );
      return result;
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to signup' };
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async postLogin(@Body() body: LoginEmailDto, @Res() res: Response) {
    try {
      let result = await this._authService.loginWithEmail(
        body.email,
        body.password,
      );
      return result;
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to login' };
    }
  }

  @Get('/login-google-url')
  getGoogleURL(@Res() res: Response) {
    try {
      let result = this._authService.generateGoogleSignInURL();
      return result;
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to generate login url' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/reset-password')
  async postResetPassword(
    @Body() body: PasswordResetDto,
    @Res() res: Response,
  ) {
    try {
      if (body.code && body.password) {
        await this._authService.resetPassword(
          body.email,
          body.code,
          body.password,
        );
        return { detail: 'sent' };
      }
      await this._authService.sendResetCode(body.email);
      return { detail: 'password updated' };
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { detail: 'unable to reset password' };
    }
  }

  @Post('/login-google-redirect')
  @HttpCode(HttpStatus.OK)
  async postLoginGoogle(@Body() body: LoginGoogleDto, @Res() res: Response) {
    try {
      let result = await this._authService.loginWithGoogle(body.code);
      res.redirect(
        `${this.configService.get('REDIRECT_URL')}?access_token=${
          result.accessToken
        }&refresh_token=${result.refreshToken}`,
      );
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      return { detail: 'unable to login via google' };
    }
  }
}
