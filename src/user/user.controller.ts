import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("/v1/users")
export class UserController {

    constructor(
        private readonly _userService: UserService
    ) { }

}