import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.enity';
//邮箱
import { emailConfig } from 'src/config/Email/email.config';
//验证
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { jwtConstants } from 'src/config/jwt/jwt.config';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret, // 密钥
      signOptions: { expiresIn: '24h' }, // token 过期时效
    }),
    //邮箱配置
    emailConfig,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
