import { PrismaService } from 'src/external/prisma.service';
import { IUserService } from './user.service.interface';
import * as bcrypt from 'bcrypt';

export class UserService implements IUserService {
  constructor(private readonly _prismaService: PrismaService) {}

  async updatePassword(userID: string, current: string, update: string) {
    let user = await this._prismaService.user.findUnique({
      where: { id: userID },
    });
    let match = await bcrypt.compare(current, user.authData['password']);
    if (!match) {
      throw new Error('unable to update the password');
    }
    user.authData['password'] = await bcrypt.hash(update, 10);
    await this._prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
    return true;
  }

  async updateProfile(userID: string, firstname: string, lastname: string) {
    let user = await this._prismaService.user.findUnique({
      where: { id: userID },
    });
    user.profileData['firstname'] = firstname;
    user.profileData['lastname'] = lastname;
    await this._prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
    return true;
  }
}
