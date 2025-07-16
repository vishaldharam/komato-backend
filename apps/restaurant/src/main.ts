import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);
  console.log(
    'Restaurant service is listening on port: ',
    process.env.RESTURANT_SERVICE_PORT ?? 3003,
  );
  await app.listen(process.env.RESTURANT_SERVICE_PORT ?? 3003);
}
bootstrap();
