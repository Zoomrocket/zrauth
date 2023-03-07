import { IsNotEmpty, IsOptional } from 'class-validator';

export class InviteUserOrgDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  organization_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  roles: Array<string>;
}

export class AddUserOrgDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  organization_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  roles: string[];

  @IsOptional()
  extra_profile_data?: any;
}

export class updateUserOrgDto {
  @IsOptional()
  name: string;

  @IsOptional()
  roles: Array<string>;

  @IsOptional()
  extra_profile_data?: any;
}
