import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  console.log(
    'AUTH service is listening on port: ',
    process.env.AUTH_SERVICE_PORT ?? 3002,
  );
  await app.listen(process.env.AUTH_SERVICE_PORT ?? 3002);
}
bootstrap();
