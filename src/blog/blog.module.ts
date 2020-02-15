import { Module, NestModule, MiddlewareConsumer, RequestMethod, Req } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, TagsSchema, BlogSchema } from './schemas';
import { RequireAdminAuth, RequireAuth } from '../middlewares';
import { AuthModule } from '../auth/auth.module';
import { UtilService } from './util.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Tags', schema: TagsSchema }]),
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
    AuthModule
  ],
  controllers: [BlogController],
  providers: [BlogService, UtilService]
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequireAdminAuth).forRoutes('/blog/category')
    consumer.apply(RequireAdminAuth).forRoutes('/blog/tags')
    consumer.apply(RequireAdminAuth).forRoutes('/blog/management-category-tag')
    consumer.apply(RequireAuth).forRoutes(
      { path: '/blog/new', method: RequestMethod.ALL }
    )
  }
}
