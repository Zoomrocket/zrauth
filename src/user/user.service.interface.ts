import { User } from "@prisma/client"

export interface IUserService {

    // updates the current password with a new password
    updatePassword(current: string, update: string): Promise<boolean>

    // update user profile
    updateProfile(firstname: string, lastname: string): Promise<boolean>

    // get user
    fetchUser(email: string): Promise<User>

}
