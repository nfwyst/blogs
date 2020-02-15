import { Injectable, HttpException } from '@nestjs/common';
import {
  CreateCategoryDto, CreateTagsDto,
  QueryCategoryDto, QueryTagsDto,
  QueryBlogDto, getAllBlogCategoriesTagsDto,
} from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Category, Tags, Blog } from '../interfaces';
import { Fields, Files } from 'formidable';
import stripHtml from 'string-strip-html';
import fs from 'fs';
import { UtilService } from './util.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Tags') private readonly tagsModel: Model<Tags>,
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    private readonly utilService: UtilService
  ) { }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const exist = await this.findCategoryByName(createCategoryDto.name)
    if (exist) throw new HttpException('分类重复', 400)
    const { name } = createCategoryDto
    const slug = slugify(name).toLowerCase() || name
    const category = new this.categoryModel({ ...createCategoryDto, slug })
    return category.save()
  }

  async createTags(createTagsDto: CreateTagsDto): Promise<Tags> {
    const exist = await this.findTagsByName(createTagsDto.name)
    if (exist) throw new HttpException('标签重复', 400)
    const { name } = createTagsDto
    const slug = slugify(name).toLowerCase() || name
    const tags = new this.tagsModel({ ...createTagsDto, slug })
    return tags.save()
  }

  findCategoryByName(name: string): Promise<Category> {
    return this.query<Category, QueryCategoryDto>('categoryModel', 'findOne', { name })
  }

  findTagsByName(name: string): Promise<Tags> {
    return this.query<Tags, QueryTagsDto>('tagsModel', 'findOne', { name })
  }

  findBlogBySlug(slug: string): Promise<Blog> {
    return this.query<Blog, QueryBlogDto | { slug: string }>('blogModel', 'findOne', { slug })
  }

  query<T, K>(modelName: string, methodName: string, queryDto: K): Promise<T> {
    return new Promise((resolve, reject) => {
      this[modelName][methodName](queryDto).exec((err: Error, data: T) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async getCategoryList(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.categoryModel.find({}).exec((err: Error, data: Category[]) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async getTagsList(): Promise<Tags[]> {
    return new Promise((resolve, reject) => {
      this.tagsModel.find({}).exec((err: Error, data: Tags[]) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.categoryModel.findOne({ slug: slug.toLowerCase() }).exec((err: Error, data: Category) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async getTagsBySlug(slug: string): Promise<Tags> {
    return new Promise((resolve, reject) => {
      this.tagsModel.findOne({ slug: slug.toLowerCase() }).exec((err: Error, data: Category) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async removeCategory(slug: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.categoryModel.findOneAndRemove({ slug: slug.toLowerCase() }).exec((err: Error, data: Category) => {
        if (err) return reject(err)
        if (data) return resolve(data)
        this.categoryModel.findOneAndRemove({
          name: slug.toLowerCase()
        }).exec((err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
    })
  }

  async removeTags(slug: string): Promise<Tags> {
    return new Promise((resolve, reject) => {
      this.tagsModel.findOneAndRemove({ slug: slug.toLowerCase() }).exec((err: Error, data: Tags) => {
        if (err) return reject(err)
        if (data) return resolve(data)
        this.tagsModel.findOneAndRemove({
          name: slug.toLowerCase()
        }).exec((err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
    })
  }

  async createBlog(createPostDto: Fields, files: Files, id: string): Promise<Blog> {
    let { title, body, categories, tags } = createPostDto
    if (!title || !title.length) throw new HttpException('标题不能为空', 400)
    if (!categories || !categories.length) throw new HttpException('至少要选择一个分类', 400)
    if (!tags || !tags.length) throw new HttpException('至少要选择一个标签', 400)
    if (title instanceof Array) title = title[0]
    if (body instanceof Array) body = body[0]
    if (categories instanceof Array) categories = categories[0]
    if (tags instanceof Array) tags = tags[0]
    categories = categories.split(',')
    tags = tags.split(',')
    const slug = slugify(title).toLowerCase() || title.toLowerCase()

    const exist = await this.findBlogBySlug(slug)
    if (exist) throw new HttpException('博文重复', 400)
    const blog = new this.blogModel({
      title,
      body,
      excerpt: this.utilService.smartTrim(body, 320, ' ', '...'),
      slug,
      mtitle: `${title} | ${process.env.APP_NAME}`,
      mdesc: stripHtml(body.substring(0, 160)),
      postedBy: id
    })
    const { photo } = files
    if (photo) {
      const { size, path, type } = photo
      if (size > 30000000) throw new HttpException('图片大小不能大于3MB', 400)
      blog.photo.data = fs.readFileSync(path)
      blog.photo.contentType = type
    }
    const result = await blog.save()
    await this.blogModel.findByIdAndUpdate(result._id, { $push: { categories } }, { new: true }).exec()
    return await this.blogModel.findByIdAndUpdate(result._id, { $push: { tags } }, { new: true }).exec()
  }

  getBlogs(): Promise<Blog[]> {
    return this.blogModel
      .find({})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      ).exec()
  }

  async getAllBlogCategoriesTags(query: getAllBlogCategoriesTagsDto): Promise<{
    blogs: Blog[],
    categories: Category[],
    size: number,
    tags: Tags[]
  }> {
    const limit = +query.limit || 10
    const skip = +query.skip || 0
    const blogs = await this.blogModel
      .find({})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        '_id title slug excerpt categories tags postedBy createdAt updatedAt'
      ).exec()
    const categories = await this.categoryModel
      .find({})
      .exec()
    const tags = await this.tagsModel
      .find({})
      .exec()
    return {
      blogs, categories, size: blogs.length, tags
    }
  }

  getBlogBySlug(slug: string): Promise<Blog> {
    return this.blogModel.findOne({ slug: slug.toLowerCase() })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select(
        '_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt'
      ).exec()
  }

  async removeBlogBySlug(slug: string): Promise<Blog> {
    return this.blogModel
      .findOneAndRemove({ slug: slug.toLowerCase() })
      .exec()
  }

  async updateBlogBySlug(fields: Fields, files: Files, _id: string, slug: string): Promise<Blog> {
    let oldBlog = await this.findBlogBySlug(slug)
    let { title, body, categories, tags } = fields
    if (title instanceof Array) title = title[0]
    if (body instanceof Array) body = body[0]
    if (categories instanceof Array) categories = categories[0]
    if (tags instanceof Array) tags = tags[0]
    if (title) {
      oldBlog.title = title
    }
    if (body) {
      oldBlog.body = body
      oldBlog.excerpt = this.utilService.smartTrim(body, 320, ' ', '...')
      oldBlog.mdesc = stripHtml(body.substring(0, 160))
    }
    if (categories) {
      oldBlog.categories = categories.split(',') as any
    }
    if (tags) {
      oldBlog.tags = tags.split(',') as any
    }
    const { photo } = files
    if (photo) {
      const { size, path, type } = photo
      if (size > 30000000) throw new HttpException('图片大小不能大于3MB', 400)
      oldBlog.photo.data = fs.readFileSync(path)
      oldBlog.photo.contentType = type
    }
    return await oldBlog.save()
  }

  getBlogPhotoBySlug(slug: string): Promise<Blog> {
    return this.blogModel
      .findOne({ slug: slug.toLowerCase() })
      .select('photo')
      .exec()
  }
}
