import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobPost } from './JobPost.entity';
import { User } from 'src/auth/entity/User.entity';

@Entity()
export class JobRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column('text')
  fileCV: string;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobrequest)
  jobPost: JobPost;

  @ManyToOne(() => User, (user) => user.jobrequest)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
