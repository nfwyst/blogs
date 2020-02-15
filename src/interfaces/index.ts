import { Request } from 'express';
import { User } from './auth.interface'
export * from './auth.interface';
export * from './enum';
export * from './category.interface';
export * from './tags.interface';
export * from './blog.interface';

export interface RequestWithToken extends Request {
  cookies: {
    token?: string
  },
  user: User | string,
  profile: object
}

export interface RequestWithProfile extends Request {
  profile: object
}

export interface RequestWithUser extends Request {
  user: {
    _id: string
  }
}
