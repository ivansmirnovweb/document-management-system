import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('documents/export')
  async exportDocuments(
    @Query() filter: ReportFilterDto,
    @Res() response: Response,
  ): Promise<void> {
    const csv = await this.reportsService.exportDocuments(filter);

    response
      .status(200)
      .setHeader('Content-Type', 'text/csv; charset=utf-8')
      .setHeader(
        'Content-Disposition',
        'attachment; filename="documents-report.csv"',
      )
      .send(csv);
  }

  @Get('executors')
  getExecutorStatistics(@Query() filter: ReportFilterDto) {
    return this.reportsService.getExecutorStatistics(filter);
  }
}
