import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RequestWithToken, User } from '../interfaces';
import { omit } from 'ramda';

@Injectable()
export class RequireAuth implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  use(req: RequestWithToken, res: Response, next: NextFunction): void {
    const { token } = req.cookies
    if (!token) return res.redirect('/auth/user/signin')
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET) as User
      this.authService.findUserById(req.user._id)
        .then((data: User) => {
          if (!data) {
            res.clearCookie('token')
            return res.redirect('/auth/user/signin')
          }
          req.profile = omit(['hashedPassword'], data.toObject({ getters: true }))
          return next()
        }).catch(() => {
          return res.redirect('/auth/user/signin')
        })
    } catch {
      return res.redirect('/auth/user/signin')
    }
  }
}
