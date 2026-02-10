import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;
}

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: String, description: 'Hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for Cloud Run / UptimeRobot' })
  @ApiOkResponse({ type: HealthResponseDto })
  health(): { status: string } {
    return { status: 'ok' };
  }
}
