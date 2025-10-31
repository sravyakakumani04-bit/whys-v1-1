// apps-v0/whys-v0-api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { SessionsModule } from './sessions/sessions.module';
import {ActionItemsModule} from './action_items/action-items.module';
import { JournalsModule } from './journals/journals.module';
import { VoiceprintsModule } from './voice_prints/voice_prints.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true ,envFilePath: ['.env','apps-v0/whys-v0-api/.env'],}), // loads .env (DATABASE_URL, etc.)
    DbModule,                                 // provides DbService
    HealthModule,                             // /health, /health/db
    UploadsModule,                            // /uploads
    UsersModule,
    QueueModule,
    AuthModule,
    TodosModule,
    SessionsModule,
    ActionItemsModule, 
    JournalsModule,
    VoiceprintsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
