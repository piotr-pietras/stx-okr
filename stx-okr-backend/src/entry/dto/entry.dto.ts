import { ApiProperty } from '@nestjs/swagger';
import { EntryStatus } from '@prisma/client';

export class EntryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  done: boolean;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty({ required: false, nullable: true })
  startDate?: Date;

  @ApiProperty({ required: false, nullable: true })
  endDate?: Date;

  @ApiProperty({ enum: EntryStatus })
  status: EntryStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedEntryResponse {
  @ApiProperty({ type: [EntryDto] })
  data: EntryDto[];

  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number' },
      page: { type: 'number' },
      limit: { type: 'number' },
      totalPages: { type: 'number' },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
