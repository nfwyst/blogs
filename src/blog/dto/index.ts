export * from './createBlog.dto'
export * from './createCategory.dto'
export * from './createTags.dto'
export * from './getBlog.dto'

import { CreateCategoryDto } from './createCategory.dto'
import { CreateBlogDto } from './createBlog.dto'

export type QueryCategoryDto = CreateCategoryDto
export type QueryTagsDto = QueryCategoryDto
export type QueryBlogDto = CreateBlogDto
