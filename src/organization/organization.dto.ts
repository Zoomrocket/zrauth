import { IsNotEmpty } from "class-validator"

export class CreateOrganizationDto {

    @IsNotEmpty()
    name: string

}
