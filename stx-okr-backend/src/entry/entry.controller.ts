import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedEntryResponse, EntryDto } from './dto/entry.dto';
import { StatisticsDto } from './dto/statistics.dto';
import { EntryStatus } from '@prisma/client';

@ApiTags('entries')
@Controller('entries')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated entries' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated entries',
    type: PaginatedEntryResponse,
  })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.entryService.findAll(
      parseInt(query.page),
      parseInt(query.limit),
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get entries statistics' })
  @ApiResponse({ status: 200, type: StatisticsDto })
  async getStatistics() {
    return this.entryService.getStatistics();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent entries' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [EntryDto] })
  async getRecentEntries(@Query('limit', ParseIntPipe) limit?: number) {
    return this.entryService.getRecentEntries(limit);
  }

  @Get('due-soon')
  @ApiOperation({ summary: 'Get entries due soon' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, type: [EntryDto] })
  async getDueSoon(@Query('days', ParseIntPipe) days?: number) {
    return this.entryService.getDueSoon(days);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue entries' })
  @ApiResponse({ status: 200, type: [EntryDto] })
  async getOverdue() {
    return this.entryService.getOverdue();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search entries by name' })
  @ApiQuery({ name: 'query', required: true })
  @ApiResponse({ status: 200, type: [EntryDto] })
  async searchByName(@Query('query') query: string) {
    return this.entryService.searchByName(query);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get entries by status' })
  @ApiParam({ name: 'status', enum: EntryStatus })
  @ApiResponse({ status: 200, type: [EntryDto] })
  async findByStatus(@Param('status') status: EntryStatus) {
    return this.entryService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entry by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: EntryDto })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async findById(@Param('id') id: string) {
    return this.entryService.findById(id);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Toggle entry completion status' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: EntryDto })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async toggleStatus(@Param('id') id: string) {
    return this.entryService.toggleStatus(id);
  }

  @Put(':id/status/:status')
  @ApiOperation({ summary: 'Update entry status' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'status', enum: EntryStatus })
  @ApiResponse({ status: 200, type: EntryDto })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: EntryStatus,
  ) {
    return this.entryService.updateStatus(id, status);
  }
}
