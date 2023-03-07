import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { RedisService } from 'src/external/redis.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { IOrganizationService } from './organization.service.interface';
import * as otp from 'otp-generator';
import { generate as GeneratePass } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class OrganizationService implements IOrganizationService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _mailerService: MailerService,
    private readonly _redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async addUser(
    email: string,
    name: string,
    password: string,
    organizationID: string,
    extraProfileData: any,
    roles: string[],
  ) {
    let hashpass = await bcrypt.hash(password, 10);
    let orguser = await this._prismaService.organizationUser.create({
      data: {
        user: {
          create: {
            email: email,
            authData: {
              password: hashpass,
            },
            profileData: {
              ...extraProfileData,
              firstname: name,
            },
          },
        },
        organization: {
          connect: {
            id: organizationID,
          },
        },
        isAdmin: false,
        roles: {
          createMany: {
            data: roles.map((role: string) => ({ name: role })),
          },
        },
      },
    });
    try {
      await this._mailerService.sendMail({
        to: email,
        subject: `Invitation: You've have joined our org`,
        html: `
          <p>Hi ${name},</p>
          <p>username: ${email}</p>
          <p>password: ${password}</p>

      `,
      });
    } catch {}
    return orguser;
  }

  async inviteUser(
    email: string,
    name: string,
    password: string,
    organizationID: string,
    roles: Array<string>,
    extraProfileData?: any,
    isInvite?: boolean,
  ):Promise<any> {
    let user = await this._prismaService.user.findUnique({
      where: { email: email },
    });

    let userId = user?.id;

    let organization = await this._prismaService.organization.findUnique({
      where: { id: organizationID },
    });
    let orgUser = await this._prismaService.organizationUser.findFirst({
      where: {
        organizationID: organizationID,
        user: {
          email: email,
        },
      },
    });

    if (!organization) {
      throw new Error('organization not found');
    } else {
      if (orgUser?.organizationID === organizationID) {
        throw new Error('already part of organization');
      }
    }

    const user_id = uuid();
    if (!user) {
      const user = await this._prismaService.user.create({
        data: {
          id: user_id,
          email: email,
          profileData: {
            ...extraProfileData,
            name,
            status: 'verified',
          },
          authData: {
            password: bcrypt.hashSync(password, 10),
            status: isInvite == true ? 1 : 2,
          },
        },
      });
      userId = user.id;
    }

    await this._prismaService.user.update({
      where: { id: userId },
      data: {
        profileData: {
          ...extraProfileData,
          name,
          status: 'verified',
        },
      },
    });

    await this._prismaService.organizationUser.create({
      data: {
        userID: userId,
        isAdmin: false,
        organizationID: organizationID,
        roles: {
          createMany: {
            data: roles.map((role: string) => ({ name: role })),
          },
        },
      },
    });

    if (user?.id) {
      await this._mailerService
        .sendMail({
          to: email,
          subject: `Invitation: You've have joined ${organization.name}`,
          html: `
          <p>Hi ${name},</p>
          <p>You've been joined  ${organization.name}</p>
          <p>username: ${email}</p>
      `,
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!isInvite) {
      await this._mailerService
        .sendMail({
          to: email,
          subject: `Invitation: You've have joined ${organization.name}`,
          html: `
            <p>Hi ${name},</p>
            <p>You've been joined  ${organization.name}</p>
            <p>username: ${email}</p>
            <p>password: ${password}</p>
            <p>Thanks,</p>
            <p>${this.configService.get('ORG_NAME')}.</p>
        `,
        })
        .catch((err) => {
          console.log(err);
        });
      return { id: user_id };
    } else {
      let code = otp.generate(6, {
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
        upperCaseAlphabets: true,
      });
      console.log('sending mail');

      await this._mailerService
        .sendMail({
          to: email,
          subject: `Invitation: You've been invited to join ${organization.name}`,
          html: `
            <p>Hi ${name},</p>
            <p>You've been invited to join ${organization.name}</p>
            <p>If you want to join please press the link <a href="${this.configService.get(
              'REDIRECT_URL',
            )}/join?user=${email}&org=${organizationID}&code=${code}&name=${name}">here</a></p>
            <p>Thanks,</p>
            <p>${this.configService.get('ORG_NAME')}.</p>
        `,
        })
        .catch((err) => {
          console.log(err);
        });
      console.log('setting invite');

      await this._redisService.client.set(
        `invite:${organizationID}-${email}`,
        JSON.stringify({
          code: code,
          name: name,
          user_id,
        }),
        { EX: this.configService.get('CODE_EXPIRY') },
      );
      return { id: user_id };
    }
  }

  async acceptInvitation(
    email: string,
    organizationID: string,
    code: string,
    password: string | null,
  ) {
    let inviteData = await this._redisService.client.get(
      `invite:${organizationID}-${email}`,
    );

    let invite = JSON.parse(inviteData);

    if (!invite || !invite.code || invite.code !== code) {
      throw new Error('unable to verify code');
    }

    await this._prismaService.user.update({
      where: {
        id: invite.user_id,
      },
      data: {
        authData: {
          password: bcrypt.hashSync(password, 10),
          status: 2,
        },
      },
    });

    await this._redisService.client.del(`invite:${organizationID}-${email}`);

    return true;
  }

  async fetchOrganizationUsers(organizationID: string) {
    let organizationUsers = await this._prismaService.organizationUser.findMany(
      {
        where: {
          organizationID: organizationID,
        },
        include: {
          user: {
            select: {
              email: true,
              profileData: true,
            },
          },
        },
      },
    );

    return organizationUsers;
  }

  async createOrganization(adminID: string, name: string) {
    let identifier = `${name}-${randomBytes(6).toString('hex')}`;

    await this._prismaService.organizationUser.create({
      data: {
        user: {
          connect: {
            id: adminID,
          },
        },
        isAdmin: true,
        organization: {
          create: {
            name: name,
            identifier: identifier,
          },
        },
      },
    });

    return true;
  }

  async assignRole(userID: string, organizationID: string, roleName: string) {
    let user = await this._prismaService.organizationUser.findFirst({
      where: { userID: userID, organizationID: organizationID },
    });

    if (!user) {
      throw new Error('user not present in organization');
    }

    await this._prismaService.role.create({
      data: {
        name: roleName,
        organizationUserID: user.id,
      },
    });

    return true;
  }

  async deleteRole(userID: string, organizationID: string, roleName: string) {
    let user = await this._prismaService.organizationUser.findFirst({
      where: { userID: userID, organizationID: organizationID },
    });

    if (!user) {
      throw new Error('user not present in organization');
    }

    await this._prismaService.role.deleteMany({
      where: {
        name: roleName,
        organizationUserID: user.id,
      },
    });

    return true;
  }

  async leaveOrganization(userID: string, organizationID: string) {
    let user = await this._prismaService.organizationUser.findFirst({
      where: { userID: userID, organizationID: organizationID },
    });

    if (!user) {
      throw new Error('you are not part of this organization');
    }

    if (user.isAdmin) {
      let admins = await this._prismaService.organizationUser.findMany({
        where: { isAdmin: true, organizationID: organizationID },
      });

      if (admins.length === 1) {
        throw new Error('admin cannot leave organization');
      }
    }

    await this._prismaService.organizationUser.delete({
      where: { id: user.id },
    });

    return true;
  }

  async deleteOrganization(organizationID: string) {
    await this._prismaService.organization.delete({
      where: {
        id: organizationID,
      },
      include: {
        users: {
          include: {
            roles: true,
          },
        },
      },
    });

    return true;
  }

  async updateUser(
    id: string,
    name?: string,
    role?: Array<string>,
    extra_profile_data?: any,
  ) {
    if (role) {
      role.map(async (r) => {
        const exists = await this._prismaService.role.findFirst({
          where: {
            name: r,
            organizationUser: {
              id,
            },
          },
        });
        if (!exists) {
          await this._prismaService.role.updateMany({
            where: {
              organizationUser: {
                id,
              },
            },
            data: {
              name: r,
            },
          });
        }
      });
    }
    return await this._prismaService.user.update({
      where: { id: id },
      data: {
        profileData: {
          firstname: name,
          ...extra_profile_data,
        },
      },
    });
  }
}
