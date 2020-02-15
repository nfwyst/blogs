import {
  Controller, Get, Post, Body, Param, Delete, UsePipes,
  ValidationPipe, Render, Response, Request, Put, Query
} from '@nestjs/common';
import { BlogService } from './blog.service'
import formidable, { Fields, Files } from 'formidable'
import { Blog, RequestWithUser, Category, Tags } from '../interfaces'
import {
  CreateCategoryDto,
  CreateTagsDto,
  getAllBlogCategoriesTagsDto
} from './dto';
import {
  Response as ExpressResponse,
} from 'express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('/category')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Response() res: ExpressResponse): Promise<void> {
    try {
      const category = await this.blogService.createCategory(createCategoryDto)
      res.status(200).json(category)
    } catch (e) {
      res.status(400).json({ error: e.message })
    }
  }

  @Post('/tags')
  @UsePipes(ValidationPipe)
  async createTags(@Body() createTagsDto: CreateTagsDto, @Response() res: ExpressResponse): Promise<void> {
    try {
      const tags = await this.blogService.createTags(createTagsDto)
      res.status(200).json(tags)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Get('/category')
  async getCategoryList(@Response() res: ExpressResponse): Promise<void> {
    try {
      const cts = await this.blogService.getCategoryList()
      res.status(200).json(cts)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Get('/tags')
  async getTagsList(@Response() res: ExpressResponse): Promise<void> {
    try {
      const tagses = await this.blogService.getTagsList()
      res.status(200).json(tagses)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Get('/category/:slug')
  async getCategoryBySlug(@Param('slug') slug: string, @Response() res: ExpressResponse): Promise<void> {
    try {
      const ct = await this.blogService.getCategoryBySlug(slug)
      res.status(200).json(ct)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Get('/tags/:slug')
  async getTagsBySlug(@Param('slug') slug: string, @Response() res: ExpressResponse): Promise<void> {
    try {
      const tags = await this.blogService.getTagsBySlug(slug)
      res.status(200).json(tags)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Delete('/category/:slug')
  async removeCategory(@Param('slug') slug: string, @Response() res: ExpressResponse): Promise<void> {
    try {
      const ct = await this.blogService.removeCategory(decodeURIComponent(slug))
      res.status(200).json(ct)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Delete('/tags/:slug')
  async removeTags(@Param('slug') slug: string, @Response() res: ExpressResponse): Promise<void> {
    try {
      const tags = await this.blogService.removeTags(slug)
      res.status(200).json(tags)
    } catch (e) {
      res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Get('/management-category-tag')
  @Render('ManagementCategoryTag')
  getManagementCategoryTag(): void { }

  @Get('/')
  @Render('BlogList')
  getBlogIndex(): void { }

  @Post('/')
  async createBlog(
    @Request() req: RequestWithUser,
    @Response() res: ExpressResponse
  ): Promise<Blog | null> {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    return await new Promise(resolve => {
      form.parse(req, async (err: Error, fields: Fields, files: Files) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return resolve(null)
        }
        try {
          const results = await this.blogService.createBlog(fields, files, req.user._id)
          res.status(200).json(results)
        } catch (e) {
          res.status(e.status || 400).json({ error: e.message })
        } finally {
          return resolve(null)
        }
      })
    })
  }

  @Get('/list')
  async getBlogs(): Promise<Blog[]> {
    return this.blogService.getBlogs()
  }

  @Get('/categories-tags')
  @UsePipes(ValidationPipe)
  getAllBlogCategoriesTags(
    @Query() query: getAllBlogCategoriesTagsDto
  ): Promise<{
    blogs: Blog[],
    categories: Category[],
    size: number,
    tags: Tags[]
  }> {
    return this.blogService.getAllBlogCategoriesTags(query)
  }

  @Get('/new')
  @Render('Blog')
  getBlogCreate(): void { }

  @Get('/detail/:slug')
  getBlogBySlug(
    @Param('slug') slug: string
  ): Promise<Blog> {
    return this.blogService.getBlogBySlug(slug)
  }

  @Get('/:slug')
  @Render('BlogDetail')
  getBlogDetail(): void { }

  @Get('/photo/:slug')
  async getPhotoBySlug(
    @Param('slug') slug: string,
    @Response() res: ExpressResponse
  ): Promise<void> {
    const blog = await this.blogService.getBlogPhotoBySlug(slug)
    res.set('Content-Type', blog.photo.contentType)
    res.send(blog.photo.data)
  }

  @Delete('/:slug')
  removeBlogBySlug(
    @Param('slug') slug: string
  ): Promise<Blog> {
    return this.blogService.removeBlogBySlug(slug)
  }

  @Put('/:slug')
  async updateBlogBySlug(
    @Request() req: RequestWithUser,
    @Response() res: ExpressResponse,
    @Param('slug') slug: string
  ): Promise<Blog | null> {
    slug = slug.toLowerCase()
    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    return await new Promise(resolve => {
      form.parse(req, async (err: Error, fields: Fields, files: Files) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return resolve(null)
        }
        try {
          const results = await this.blogService.updateBlogBySlug(fields, files, req.user._id, slug)
          res.status(200).json(results)
        } catch (e) {
          res.status(e.status || 400).json({ error: e.message })
        } finally {
          return resolve(null)
        }
      })
    })
  }
}
