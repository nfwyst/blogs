import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Next from 'next';
import { RenderModule } from 'nest-next';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const isDev = process.env.NODE_ENV !== 'production'

async function bootstrap() {
  const app = Next({ dev: isDev });
  await app.prepare();

  const server = await NestFactory.create(AppModule);
  server.use(morgan(isDev ? 'dev' : 'production'))
    .use(cookieParser())
  const renderer = server.get(RenderModule);
  renderer.register(server, app, { viewsDir: null });
  await server.listen(process.env.PORT);
}
bootstrap();
