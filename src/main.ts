import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* await app.listen(3000); */

  const port: number = +process.env.PORT || 3000;

  await app
    .listen(port)
    .then(() => console.log(`App is listening on port ${port}.`));

}
bootstrap();