import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginAuthDto } from './dto/loginAuth.dto';
import { registerAuthDTO } from './dto/registerAuth.dto';
import { emailCodeAuthDto } from './dto/emailCode.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.enity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
//图片验证码
import * as svgCaptcha from 'svg-captcha';
//
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  //获取图片验证码
  async imgCode(req, res, type: string) {
    const captcha = await svgCaptcha.create({
      size: 1, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });

    if (type == '1') {
      req.session.imgEmailCode = captcha.text; //邮箱
    } else {
      req.session.imgCode = captcha.text; //
    }
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
  //邮箱验证码
  async emailCode(body: emailCodeAuthDto, req) {
    console.log(req.session.emailCode);
    if (body.imgCode == req.session.emailCode) {
      return this.sendEmailCode({ email: body.email }, req);
    } else {
      return { code: 201, message: '验证码错误' };
    }
  }
  //注册
  async register(body: registerAuthDTO, req) {
    const { email, password, checkPwd, imgCode, emailCode } = body;
    if (imgCode == req.session.imgEmailCode)
      return { code: 201, message: '图片验证码错误' };
    if (emailCode == req.session.emailCode)
      return { code: 201, message: '邮箱验证码错误' };
    if (password != checkPwd)
      return { code: 201, message: '两次输入密码不一致' };
    const newUser = new User();
    const hasUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (hasUser) {
      return { code: 201, message: '用户已存在' };
    }
    newUser.email = email;
    newUser.password = password;
    await this.userRepository.save(newUser);

    return { code: 200, message: '注册成功' };
  }
  //登录
  async login(body: loginAuthDto, req) {
    const { email, password, imgCode } = body;
    if (imgCode == req.session.imgEmailCode)
      return { code: 201, message: '图片验证码错误' };
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      return { code: 201, message: '用户不存在' };
    }
    if (password != user.password) {
      return { code: 201, message: '密码错误' };
    }
    const data = {
      token: 'token',
    };
    return { code: 200, data, message: '登录成功' };
  }

  //发送邮箱验证码 
  async sendEmailCode(data, req) {
    try {
      const code = Math.random().toString().slice(-6);
      const date = '2021年03月18日 22:27:49';
      const sendMailOptions: ISendMailOptions = {
        to: data.email,
        subject: data.subject || '用户邮箱验证',
        template: 'validate.code.ejs', //这里写你的模板名称，如果你的模板名称的单名如 validate.ejs ,直接写validate即可 系统会自动追加模板的后缀名,如果是多个，那就最好写全。
        //内容部分都是自定义的
        context: {
          code, //验证码
          date, //日期
          sign: data.sign || '系统邮件,回复无效。', //发送的签名,当然也可以不要
        },
        // attachments: [
        //     {
        //         filename: 'validate.code.ejs', //文件名
        //         path: path.join(process.cwd(), './src/email/template/validate.code.ejs') //服务端的文件地址
        //     }
        // ]
      };
      this.mailerService
        .sendMail(sendMailOptions)
        .then(() => {
          console.log(
            `发送邮件给:${data.email},成功!主题:${data.subject || '默认'}`,
          );
        })
        .catch((error) => {
          console.log(
            `发送邮件给:${data.email}出错!主题:${data.subject || '默认'}`,
            error,
          );
        });
      req.session.emailCode = code;
      return { code: 200, message: '发送成功' };
    } catch (error) {
      console.error('发送邮件出错:', error);
      return { error };
    }
  }
}
