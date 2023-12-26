import { Controller, Get, Param } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private scrapingService: ScrapingService) {}

  @Get(':department')
  getInitiatives(@Param('department') department: string) {
    return this.scrapingService.getInitiatives(department);
  }
}
