import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedEntryResponse } from './dto/entry.dto';
import { EntryStatus } from '@prisma/client';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedEntryResponse> {
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.entry.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.entry.count(),
    ]);

    return {
      data: entries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const entry = await this.prisma.entry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException(`Entry with ID ${id} not found`);
    return entry;
  }

  async findByStatus(status: EntryStatus) {
    return this.prisma.entry.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchByName(query: string) {
    return this.prisma.entry.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }

  async getStatistics() {
    const [total, completed, pending] = await Promise.all([
      this.prisma.entry.count(),
      this.prisma.entry.count({ where: { done: true } }),
      this.prisma.entry.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      total,
      completed,
      pending,
      completionRate: total ? (completed / total) * 100 : 0,
    };
  }

  async toggleStatus(id: string) {
    const entry = await this.findById(id);
    return this.prisma.entry.update({
      where: { id },
      data: { done: !entry.done },
    });
  }

  async getRecentEntries(limit: number = 5) {
    return this.prisma.entry.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDueSoon(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.entry.findMany({
      where: {
        endDate: {
          lte: futureDate,
          gte: new Date(),
        },
        done: false,
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async getOverdue() {
    return this.prisma.entry.findMany({
      where: {
        endDate: {
          lt: new Date(),
        },
        done: false,
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async updateStatus(id: string, status: EntryStatus) {
    await this.findById(id);
    return this.prisma.entry.update({
      where: { id },
      data: { status },
    });
  }
}
