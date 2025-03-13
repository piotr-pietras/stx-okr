import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  completed: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  completionRate: number;
} 