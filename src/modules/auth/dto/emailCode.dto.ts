import { IsNotEmpty } from 'class-validator';

export class emailCodeAuthDto {
  @IsNotEmpty({ message: '邮箱不可以为空' })
  readonly email: string;

  @IsNotEmpty({ message: '验证码不可以为空' })
  readonly imgCode: string;
}
