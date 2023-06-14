import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port: number = +process.env.PORT || 8000;

  await app
    .listen(port)
    .then(() => console.log(`App is listening on port ${port}.`));

}
bootstrap();