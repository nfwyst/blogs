import { Document } from 'mongoose'

export interface Category extends Document {
  name: string,
  slug: string,
}
