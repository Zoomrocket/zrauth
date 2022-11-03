import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/external/prisma.service";
import { IOrganizationService } from "./organization.service.interface";

@Injectable()
export class OrganizationService implements IOrganizationService {

    constructor(
        private readonly _prismaService: PrismaService
    ) { }

    async createOrganization(adminID: string, name: string) {

        await this._prismaService.organizationUser.create({
            data: {
                user: {
                    connect: {
                        id: adminID
                    }
                },
                isAdmin: true,
                organization: {
                    create: {
                        name: name
                    }
                }
            }
        });

        return true;
    }

    async assignRole(userID: string, organizationID: string, roleName: string) {

        let user = await this._prismaService.organizationUser.findFirst({ where: { userID: userID, organizationID: organizationID } });

        if (!user) {
            throw new Error("user not present in organization")
        }

        await this._prismaService.role.create({
            data: {
                name: roleName,
                organizationUserID: user.id
            }
        });

        return true;

    }

    async deleteRole(userID: string, organizationID: string, roleName: string) {

        let user = await this._prismaService.organizationUser.findFirst({ where: { userID: userID, organizationID: organizationID } });

        if (!user) {
            throw new Error("user not present in organization")
        }

        await this._prismaService.role.deleteMany({
            where: {
                name: roleName,
                organizationUserID: user.id
            }
        });

        return true;
    }

    async leaveOrganization(userID: string, organizationID: string) {

        let user = await this._prismaService.organizationUser.findFirst({ where: { userID: userID, organizationID: organizationID } });

        if (!user) {
            throw new Error("you are not part of this organization");
        }

        if (user.isAdmin) {

            let admins = await this._prismaService.organizationUser.findMany({ where: { isAdmin: true, organizationID: organizationID } });

            if (admins.length === 1) {
                throw new Error("admin cannot leave organization")
            }

        }

        await this._prismaService.organizationUser.delete({ where: { id: user.id } });

        return true;
    }

    async deleteOrganization(organizationID: string) {

        await this._prismaService.organization.delete({
            where: {
                id: organizationID
            },
            include: {
                users: {
                    include: {
                        roles: true
                    }
                }
            }
        });

        return true;
    }

    async addOrganizationUser(userID: string, organizationID: string) {

        await this._prismaService.organizationUser.create({
            data: {
                userID: userID,
                organizationID: organizationID
            }
        });

        return true;
    }

}
