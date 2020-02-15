import {
  Controller, Post, UsePipes, ValidationPipe, Body, Get, Response, Render, Request, Res
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express'
import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dto';
import { pick } from 'ramda';
import jwt from 'jsonwebtoken';
import { RequestWithToken, RequestWithProfile } from '../interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/user')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto, @Response() res: ExpressResponse): Promise<void> {
    try {
      const user = await this.authService.createUser(createUserDto)
      res.status(200).json(user)
    } catch (e) {
      res.status(e.status || 400).json({
        error: e.message
      })
    }
  }

  @Post('/user/signin')
  async userSignin(@Body() signInUserDto: SignInUserDto, @Response() res: ExpressResponse):
    Promise<ExpressResponse> {
    try {
      const { token, user } = await this.authService.signIn(signInUserDto)
      res.cookie('token', token, { maxAge: 86400000 })
      return res.status(200).json({ user: pick(['_id', 'username', 'name', 'email', 'role'], user) })
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message })
    }
  }

  @Post('/user/signout')
  userLogout(@Response() res: ExpressResponse): ExpressResponse {
    res.clearCookie('token')
    return res.status(200).json({ message: '用户已注销!' })
  }

  @Get('/user/signin')
  getSignIn(@Request() req: RequestWithToken, @Res() res: ExpressResponse): void {
    const { token } = req.cookies
    if (!token) return res.render('SignIn')
    try {
      jwt.verify(token, process.env.JWT_SECRET)
      return res.redirect('/')
    } catch {
      return res.render('SignIn')
    }
  }

  @Get('/user/signup')
  @Render('SignUp')
  getSignUp(): void { }

  @Get('/user')
  getUsers(): any {
    return 'hello'
  }

  @Get('/user/profile')
  getUserProfile(@Request() req: RequestWithProfile, @Response() res: ExpressResponse): void {
    res.json(req.profile)
  }
}
