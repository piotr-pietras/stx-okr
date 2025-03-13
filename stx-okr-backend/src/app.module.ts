import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EntryModule } from './entry/entry.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, EntryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
