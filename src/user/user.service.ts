import { PrismaService } from 'src/external/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly _prismaService: PrismaService,
  ) { }


  async getAllUsers() {
    let users = await this._prismaService.user.findMany({});
    return users;
  }

  async deleteUser(userID: string) {
    await this._prismaService.user.delete({
      where: {
        id: userID
      }
    });

    return true;
  }

  async getUserOrganizationsByEmail(email: string) {
    let user = await this._prismaService.user.findUnique({
      where: {
        email: email
      }
    });

    if(!user) {
      return [];
    }

    let members = await this._prismaService.organizationUser.findMany({
      where: {
        userID: user.id
      },
      include: {
        roles: true,
        organization: true
      }
    })

    return members;

  }

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

  async changeEmailAddress(existingEmail: string, newEmail: string) {

    await this._prismaService.user.update({
      where: {
        email: existingEmail
      },
      data: {
        email: newEmail
      }
    });

    return 1;

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
