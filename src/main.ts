import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AllExceptionsFilter } from './filers/base.exception.filter';
import { HttpExceptionFilter } from './filers/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { sessionConfig } from './config/session/session.config';
import { JwtAuthGuard } from './guard/jwtAuth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  //拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  //session验证
  app.use(sessionConfig);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
