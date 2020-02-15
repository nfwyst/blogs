import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { RenderModule } from 'nest-next';
import { RequireAdminAuth, RequireAuth } from '../middlewares'
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RenderModule, AuthModule],
  controllers: [DashboardController]
})
export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequireAuth).forRoutes('/dashboard/user')
    consumer.apply(RequireAdminAuth).forRoutes('/dashboard/admin')
  }
}
