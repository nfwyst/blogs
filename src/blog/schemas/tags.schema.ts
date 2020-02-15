import { Schema } from 'mongoose'

export const TagsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    max: 32,
  },
  slug: {
    type: String,
    unique: true,
    index: true
  }
}, {
  timestamps: true,
})
