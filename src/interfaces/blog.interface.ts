import { Document } from 'mongoose'
import { Category } from './category.interface'
import { Tags } from './tags.interface'

export interface Blog extends Document {
  title: string,
  slug: string,
  body: any,
  excerpt: string,
  mtitle: string,
  mdesc: string,
  photo?: {
    data: Buffer,
    contentType: string
  },
  categories?: Category[],
  tags?: Tags[]
  postedBy: string
}
