import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);

  console.log(`App started at port ${process.env.PORT}`);
}
bootstrap();
