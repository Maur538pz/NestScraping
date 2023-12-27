import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
  async getInitiatives(department: string) {
    const departmentMin = department.toLowerCase();
    const url = `https://www.pods.pe/mapa/lista.php?reg=${departmentMin}&ods=15&tem=undefined&tip=undefined`;
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.goto(url);

    const response: string[][] = await page.evaluate(() => {
      const numIniciativas: number = Number(
        (document.querySelector('.num > span') as HTMLElement).innerText,
      );
      if (!numIniciativas) {
        return [];
      }
      const campos: string[] = [
        ...document.querySelectorAll('thead > tr > :not(.sep)'),
      ].map((e: HTMLElement) => e.innerText);

      const nodeContent: NodeList = document.querySelectorAll('tbody > tr');

      const content: string[][] = [...nodeContent].map((e: HTMLElement) =>
        [...e.querySelectorAll(':not(.sep)')]
          .map((td: HTMLElement) => td.innerText)
          .slice(1),
      );

      return [campos, ...content];
    });
    await browser.close();
    return response;
  }
}
