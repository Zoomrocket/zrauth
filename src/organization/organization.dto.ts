import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  name: string;
}

export class SendInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  roles: Array<string>;
}

export class AcceptInvitationDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;

  password: string;
}
