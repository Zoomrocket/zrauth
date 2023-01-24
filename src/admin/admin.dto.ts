import { IsNotEmpty, IsOptional } from 'class-validator';

export class InviteUserOrgDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  organization_id: string;

  @IsNotEmpty()
  name: string;

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
  roles: Array<string>;

  @IsOptional()
  extra_profile_data?: any;
}

export class updateUserOrgDto {
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  organization_id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  roles: Array<string>;

  @IsOptional()
  extra_profile_data?: any;
}
