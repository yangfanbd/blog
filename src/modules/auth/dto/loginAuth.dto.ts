import { IsNotEmpty } from 'class-validator';

export class loginAuthDto {
  @IsNotEmpty({ message: '邮箱不可以为空' })
  readonly email: string;

  @IsNotEmpty({ message: '密码不可以为空' })
  readonly password: string;

  @IsNotEmpty({ message: '验证码不可以为空' })
  readonly imgCode: string;
}
