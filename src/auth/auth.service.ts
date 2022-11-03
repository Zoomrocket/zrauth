import { Injectable } from "@nestjs/common";
import { MailerService } from "src/external/mailer.service";
import { PrismaService } from "src/external/prisma.service";
import { RedisService } from "src/external/redis.service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { AccessTokenClaims, RefreshTokenClaims } from "./claims.interface";
import { keys } from "src/keys";
import { google } from "googleapis";
import { IAuthService } from "./auth.service.interface";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService implements IAuthService {

    constructor(
        private readonly _prismaService: PrismaService,
    ) { }

    private async generateTokenPair(userID: string) {

        let user = await this._prismaService.user.findUnique({
            where: {
                id: userID
            },
            include: {
                organizations: {
                    include: {
                        organization: true,
                        roles: true
                    }
                }
            }
        });

        let access_id = randomUUID();
        let refresh_id = randomUUID();

        let accessClaims: AccessTokenClaims = {
            jti: access_id,
            aud: "account",
            typ: "Bearer",
            scope: "email profile",
            iss: keys.SERVER_URL,
            user_id: user.id,
            email: user.email,
            profile_data: user.profileData,
            organizations: user.organizations.map(organization => ({
                organization_id: organization.organizationID,
                name: organization.organization.name,
                is_admin: organization.isAdmin,
                roles: organization.roles.map(role => role.name)
            }))
        }

        let refreshClaims: RefreshTokenClaims = {
            jti: refresh_id,
            user_id: user.id,
            aud: "account",
            typ: "Refresh",
            iss: keys.SERVER_URL,
            scope: "email profile"
        }

        let accessToken = jwt.sign(accessClaims, keys.ACCESS_SECRET, { expiresIn: keys.ACCESS_TOKEN_EXP });
        let refreshToken = jwt.sign(refreshClaims, keys.REFRESH_SECRET, { expiresIn: keys.REFRESH_TOKEN_EXP });

        return { accessToken, refreshToken }

    }

    async createAccount(email: string, password: string, firstname: string, lastname: string, organization: string) {

        let hashpass: string = "";

        if (!password) throw new Error("password required for email signup");
        hashpass = await bcrypt.hash(password, 10);

        await this._prismaService.organizationUser.create({
            data: {
                user: {
                    create: {
                        email: email,
                        profileData: {
                            firstname: firstname,
                            lastname: lastname,
                            status: "pending_verification"
                        },
                        authData: {
                            password: hashpass
                        }
                    }
                },
                organization: {
                    create: {
                        name: organization
                    }
                },
                isAdmin: true
            }
        })
        return true;
    }

    async loginWithEmail(email: string, password: string) {
        let user = await this._prismaService.user.findUnique({ where: { email: email } });

        if (!user.authData["password"]) {
            throw new Error("invalid login method");
        }

        let match = await bcrypt.compare(password, user.authData["password"]);

        if (!match) {
            throw new Error("passwords dont match");
        }

        let tokenPair = await this.generateTokenPair(user.id);

        return {
            access_token: tokenPair.accessToken,
            refresh_token: tokenPair.refreshToken
        }
    }

    generateGoogleSignInURL() {
        const client = new google.auth.OAuth2({
            clientId: keys.GOOGLE_CLIENT_ID,
            clientSecret: keys.GOOGLE_CLIENT_SECRET,
            redirectUri: `${keys.SERVER_URL}/v1/auth/login-google-redirect`
        })

        const scopes = [
            "email",
            "openid",
            "profile"
        ]

        const url = client.generateAuthUrl({
            access_type: "offline",
            scope: scopes
        });

        return { url: url };
    }

    async loginWithGoogle(code: string) {
        const client = new google.auth.OAuth2({
            clientId: keys.GOOGLE_CLIENT_ID,
            clientSecret: keys.GOOGLE_CLIENT_SECRET,
            redirectUri: `${keys.SERVER_URL}/v1/auth/login-google-redirect`
        })
        let { tokens } = await client.getToken(code);
        let googleProfile = jwt.decode(tokens.id_token);

        let user = await this._prismaService.user.findUnique({
            where: {
                email: googleProfile["email"]
            }
        });

        let profileData = {
            firstname: googleProfile["given_name"],
            lastname: googleProfile["family_name"],
            picture: googleProfile["picture"],
            status: googleProfile["status"]
        }

        if (user) {
            user.profileData = profileData;
            await this._prismaService.user.update({ where: { id: user.id }, data: user });
        }

        if (!user) {
            user = await this._prismaService.user.create({
                data: {
                    email: googleProfile["email"],
                    profileData: profileData,
                    authData: {
                        password: null
                    }
                }
            });
        }

        let tokenPair = await this.generateTokenPair(user.id);

        return {
            access_token: tokenPair.accessToken,
            refresh_token: tokenPair.refreshToken
        }
    }

    async refreshAccessToken(refreshToken: string) {

        let decoded = jwt.verify(refreshToken, keys.REFRESH_SECRET);

        let userData = await this._prismaService.user.findUnique({
            where: {
                id: decoded["user_id"]
            },
            include: {
                organizations: {
                    include: {
                        organization: true,
                        roles: true
                    }
                }
            }
        });

        let tokenPair = await this.generateTokenPair(userData.id);

        return {
            access_token: tokenPair.accessToken,
            refresh_token: refreshToken
        }
    }

}
