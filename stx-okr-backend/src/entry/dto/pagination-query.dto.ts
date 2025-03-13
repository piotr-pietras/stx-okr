import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
