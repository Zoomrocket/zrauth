import { PrismaService } from "src/external/prisma.service";
import { IUserService } from "./user.service.interface";

export class UserService implements IUserService {

    constructor(
        private readonly _prismaService: PrismaService
    ) { }

    async updatePassword(current: string, update: string) {
        return true;
    }
    
    async updateProfile(firstname: string, lastname: string) {
        return true;
    }
    
    async fetchOrganizations(userID: string) {
        
        return true;
    }

}
