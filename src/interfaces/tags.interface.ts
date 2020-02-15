import { Document } from 'mongoose';

export interface Tags extends Document {
  name: string;
  slug: string;
}
