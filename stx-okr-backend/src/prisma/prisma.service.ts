import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@stx-okr-postgres:5432/postgres?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
