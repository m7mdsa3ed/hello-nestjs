import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * This needed to fix serialization of BigInt to JSON
 * because JSON.stringify() doesn't support BigInt
 */
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}

bootstrap();
