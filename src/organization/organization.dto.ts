import { IsEmail, IsNotEmpty } from "class-validator"

export class CreateOrganizationDto {

    @IsNotEmpty()
    name: string

}

export class SendInvitationDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    name: string

}

export class AcceptInvitationDto {

    @IsNotEmpty()
    user_id: string

    @IsNotEmpty()
    code: string

    password: string

}
