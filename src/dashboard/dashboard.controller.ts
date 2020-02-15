import { Controller, Render, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  @Get('/user')
  @Render('UserProfile')
  getUserProfile(): void { }

  @Get('/admin')
  @Render('AdminProfile')
  getAdminProfile(): void { }
}
