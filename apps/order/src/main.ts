import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const port = process.env.ORDER_SERVICE_PORT ?? 3004;
  console.log(`app listening on PORT - ${port}`);
  await app.listen(port);
}
bootstrap();
