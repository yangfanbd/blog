import { IsNotEmpty } from 'class-validator';
export class registerAuthDTO {
  @IsNotEmpty({ message: '邮箱不可以为空' })
  readonly email: string;

  @IsNotEmpty({ message: '密码不可以为空' })
  readonly password: string;

  @IsNotEmpty({ message: '请确认密码' })
  readonly checkPwd: string;

  @IsNotEmpty({ message: '邮箱验证码不可以为空' })
  readonly emailCode: string;

  @IsNotEmpty({ message: '验证码不可以为空' })
  readonly imgCode: string;
}
