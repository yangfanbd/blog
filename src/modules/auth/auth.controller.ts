import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAuthDto } from './dto/loginAuth.dto';
import { registerAuthDTO } from './dto/registerAuth.dto';
import { emailCodeAuthDto } from './dto/emailCode.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //图片验证码
  @Get('imgCode')
  async imgCode(@Req() req, @Res() res, @Query() data) {
    return this.authService.imgCode(req, res, data.type);
  }

  //邮箱验证码
  @Post('emailCode')
  async emailCode(@Body() body: emailCodeAuthDto, @Req() req) {
    return this.authService.emailCode(body, req);
  }

  //注册
  @Post('register')
  register(@Body() body: registerAuthDTO, @Req() req) {
    return this.authService.register(body, req);
  }

  //登录
  @Post('login')
  async login(@Body() body: loginAuthDto, @Req() req) {
    return this.authService.login(body, req);
  }
}
