import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as YAML from 'yaml';
import { ConfigService as EnvService } from '@nestjs/config';
import simpleGit from 'simple-git';

@Injectable()
export class ConfigService {
    private readonly repoPath: string;
    private readonly git;
    private readonly logger = new Logger(ConfigService.name);

    constructor(private readonly envService: EnvService) {
        // Use value from .env or fallback to './config-repo'
        const configPath =
            this.envService.get<string>('CONFIG_REPO') ?? './config-repo';
        this.repoPath = path.resolve(configPath);
        this.git = simpleGit(this.repoPath);
    }

    async getConfig(
        application: string,
        profile: string,
        format: 'yml' | 'yaml' | 'properties',
        commitHash = 'HEAD',
    ): Promise<any> {
        const ext = format === 'yaml' ? 'yml' : format; // normalize .yaml to .yml
        const fileName = `${application}-${profile}.${ext}`;

        let content: string;
        try {
            content = await this.git.show(`${commitHash}:${fileName}`);
        } catch (err) {
            if (err.message.includes('not exist')) {
                throw new NotFoundException(`Cannot find ${fileName} at ${commitHash}`);
            }
            throw new Error(
                `Failed to retrieve ${fileName} at ${commitHash}: ${err.message}`,
            );
        }

        // ✅ Validate YAML syntax only if it's a YAML file
        if (ext === 'yml') {
            try {
                YAML.parse(content);
            } catch (err) {
                throw new Error(`Invalid YAML format: ${err.message}`);
            }
        }
        this.logger.debug(`Retrieved ${fileName} at ${commitHash}`);
        return content;
    }

    async gitConfigFile(fileName: string, format: string, commitHash = 'HEAD',): Promise<string> {
        const ext = format === 'yaml' ? 'yml' : format; // normalize .yaml to .yml
        let content: string;

        try {
            content = await this.git.show(`${commitHash}:${fileName.replace('.yaml', '.yml')}`);
        } catch (err) {
            if (err.message.includes('not exist')) {
                throw new NotFoundException(`Cannot find ${fileName} at ${commitHash}`);
            }
            throw new Error(`Failed to retrieve ${fileName} at ${commitHash}: ${err.message}`);
        }

        // ✅ Validate YAML syntax only if it's a YAML file
        if (ext === 'yml') {
            try {
                YAML.parse(content);
            } catch (err) {
                throw new Error(`Invalid YAML format: ${err.message}`);
            }
            return content;
        }
    }
}
