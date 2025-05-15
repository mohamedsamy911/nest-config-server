import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule as GitConfigModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), GitConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
