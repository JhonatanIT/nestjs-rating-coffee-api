import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('greeting')
  greet(): string {
    return 'Hello, world!';
  }
}
