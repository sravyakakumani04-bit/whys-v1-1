import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // Allow your mock UI to call the API during dev
  app.enableCors({
    origin: true, // tighten to your domains later
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Accept larger request bodies if needed
  app.use(json({ limit: '25mb' }));
  app.use(urlencoded({ extended: true, limit: '25mb' }));

  // Basic DTO validation (whitelist unknown fields, auto-transform types)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const PORT = Number(process.env.PORT) || 5000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`API running at http://localhost:${PORT}`);
  
}
bootstrap();
