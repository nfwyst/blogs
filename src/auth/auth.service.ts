import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import { User } from '../interfaces'
import { CreateUserDto, QueryUserDto, SignInUserDto } from './dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user1 = await this.findUserByName(createUserDto.name)
    if (user1) throw new HttpException('用户名已被使用', HttpStatus.BAD_REQUEST)
    const user = await this.findUserByEmail(createUserDto.email)
    if (user) throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST)
    const username = shortid.generate()
    const profile = `/profile/${username}`
    const createdUser = new this.userModel({
      ...createUserDto,
      username,
      profile
    })
    return createdUser.save()
  }

  async signIn(signInUserDto: SignInUserDto): Promise<{ user: User, token: string }> {
    const user = await this.findUserByEmail(signInUserDto.email)
    if (!user) throw new HttpException(
      'User With that email does not exist. Please signup', HttpStatus.BAD_REQUEST
    )
    if (!user.authenticate(signInUserDto.password)) throw new HttpException(
      'Email and password do not match', HttpStatus.BAD_REQUEST
    )
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return { user, token }
  }

  query<T>(methodName: string, queryUserDto: QueryUserDto): Promise<T> {
    return new Promise((resolve, reject) => {
      this.userModel[methodName](queryUserDto).exec((err: Error, data: T) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  findUserByEmail(email: string): Promise<User> {
    return this.query<User>('findOne', { email })
  }

  findUserByName(name: string): Promise<User> {
    return this.query<User>('findOne', { name })
  }

  findUserById(id: number): Promise<User> {
    return this.query<User>('findOne', { _id: id })
  }
}
