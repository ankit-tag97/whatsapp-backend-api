import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { InstancesModule } from './instances/instances.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WhatsappModule,
    UsersModule,
    PrismaModule,
    InstancesModule,
    ConfigModule,
  ],
})
export class AppModule {}
