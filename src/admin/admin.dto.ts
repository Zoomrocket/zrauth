import { IsNotEmpty } from "class-validator";

export class AddUserOrgDto {
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    organization_id: string

    @IsNotEmpty()
    name: string

}