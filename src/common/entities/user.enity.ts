import {
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export class User {
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  // 软删除
  @Column({
    default: false,
    select: false,
  })
  isDelete: boolean;

  //邮箱
  @Column()
  email: string;

  //密码
  @Column()
  password: string;

  // portrait	用户头像
  @Column({ nullable: true })
  portrait: string;

  // describe	签名
  @Column({ nullable: true })
  describe: string;

  // gender	性别
  @Column({ default: true })
  gender: boolean;
}
