import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsOptional()
  extra_profile_data?: any;
}

export class AcceptInvitationDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;

  password: string;
}
