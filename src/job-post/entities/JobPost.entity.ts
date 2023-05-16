import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { JobRequest } from './JobRequest.entity';
import { User } from 'src/auth/entity/User.entity';

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @OneToMany(() => JobRequest, (jobrequest) => jobrequest.jobPost)
  jobrequest: JobRequest[];

  @ManyToOne(() => User, (user) => user.jobpost)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
