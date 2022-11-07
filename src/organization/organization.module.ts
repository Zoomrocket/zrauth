import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
    providers: [
        OrganizationService,
        PrismaService
    ],
    controllers: [
        OrganizationController
    ]
})
export class OrganizationModule { }
