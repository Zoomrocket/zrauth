import { IsNotEmpty, IsEmail } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  refresh_token: string;
}

export class LoginEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginGoogleDto {
  @IsNotEmpty()
  code: string;
}

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  organization: string;

  organizationData: any;

}

export class PasswordResetDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  code: string;

  password: string;
}
