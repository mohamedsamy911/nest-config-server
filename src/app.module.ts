import { Module } from '@nestjs/common';
import { ConfigModule as GitConfigModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), GitConfigModule],
})
export class AppModule { }
