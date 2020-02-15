import * as mongoose from 'mongoose';
import crypto from 'crypto';
const { Schema } = mongoose

export const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    max: 32,
    unique: true,
    index: true,
    lowerCase: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    max: 32,
    lowerCase: true
  },
  profile: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: String,
  about: {
    type: String,
  },
  role: {
    type: Number,
    default: 0
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  resetPasswordLink: {
    data: String,
    default: ''
  }
}, {
  timestamps: true
});

UserSchema.virtual('password')
  .set(function (password: string): void {
    this._password = password;
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password, this.salt)
  })
  .get(function (): string {
    return this._password
  })

UserSchema.methods = {
  authenticate: function (plainText: string): boolean {
    return this.encryptPassword(plainText, this.salt) === this.hashedPassword
  },
  encryptPassword: (password: string, salt: string): string => {
    try {
      return crypto.createHmac('sha1', salt)
        .update(password)
        .digest('hex')
    } catch (e) {
      return ''
    }
  },
  makeSalt: (): string => {
    return `${Math.round(new Date().valueOf() * Math.random())}`
  }
}

export default UserSchema
