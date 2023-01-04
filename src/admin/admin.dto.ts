import { IsNotEmpty } from "class-validator";

export class InviteUserOrgDto {
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    organization_id: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    roles: Array<string>

}

export class AddUserOrgDto {
    @IsNotEmpty()
    email: string


    @IsNotEmpty()
    password: string


    @IsNotEmpty()
    organization_id: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    roles: Array<string>

}