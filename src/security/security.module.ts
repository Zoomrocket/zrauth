import { Module } from '@nestjs/common';
import { PrismaService } from 'src/external/prisma.service';

@Module({
    providers: [
        PrismaService
    ]
})
export class SecurityModule {}
