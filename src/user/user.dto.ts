import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  current: string;

  @IsNotEmpty()
  update: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}
