import { Document } from 'mongoose'

export interface User extends Document {
  username: string,
  name: string,
  email: string,
  profile: string,
  hashedPassword: string,
  salt: number,
  about: string,
  role: number,
  photo: string,
  resetPasswordLink: string,
  authenticate: (text: string) => boolean,
  _id: number,
}
