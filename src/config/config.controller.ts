import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ConfigService } from './config.service';
import * as path from 'path';
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

  @Get(':fileName')
  async getConfigFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
    @Query('commit') commitHash?: string,
  ) {
    try {
      const ext = path.extname(fileName).slice(1); // Get the file extension
      if (!['yml', 'yaml', 'properties'].includes(ext)) {
        return res.status(400).send({
          error: 'Invalid file extension',
          message: 'Only .yml, .yaml, and .properties files are supported',
          fileName,
        });
      }
      const content = await this.configService.gitConfigFile(
        fileName,
        ext,
        commitHash,
      );
      const contentType = ext === 'properties' ? 'text/plain' : 'text/yaml';
      res.setHeader('Content-Type', contentType);
      res.send(content);
    } catch (error) {
      res.status(500).send({
        error: 'Failed to retrieve configuration file',
        message: error.message,
      });
    }
  }
}
