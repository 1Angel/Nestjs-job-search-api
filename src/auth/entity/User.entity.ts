import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './Role.entity';
import { JobRequest } from 'src/job-post/entities/JobRequest.entity';
import { JobPost } from 'src/job-post/entities/JobPost.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  email: string;


  @Exclude()
  @Column('text')
  password: string;

  @Column('text', { default: Role.User })
  roles: Role[];

  @OneToMany(() => JobRequest, (jobrequest) => jobrequest.user)
  jobrequest: JobRequest[];

  @OneToMany(() => JobPost, (jobPost) => jobPost.user)
  jobpost: JobPost[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
