import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    providers: [
        UserService,
        PrismaService
    ],
    controllers: [
        UserController
    ]
})
export class UserModule {}
