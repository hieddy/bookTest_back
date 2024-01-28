import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { separateJaso } from './es/utils/jaso.utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test() {
    return console.log(separateJaso('위아래'));
  }
}
