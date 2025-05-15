import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Response } from 'express';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) { }

  @Get(':application/:profile')
  async getConfig(
    @Param('application') application: string,
    @Param('profile') profile: string,
    @Res() res: Response,
    @Query('format') format: 'yml' | 'yaml' | 'properties' = 'yml',
    @Query('commit') commitHash?: string,
  ) {
    try {
      const content = await this.configService.getConfig(
        application,
        profile,
        format,
        commitHash,
      );
      const contentType = format === 'properties' ? 'text/plain' : 'text/yaml';
      res.setHeader('Content-Type', contentType);
      res.send(content);
    } catch (error) {
      res.status(500).send({
        error: 'Failed to retrieve configuration',
        message: error.message,
      });
    }
  }

  @Get('commits')
  async listCommits() {
    return this.configService.listCommits();
  }
}
