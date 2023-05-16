import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/JobPost.entity';
import { JobRequest } from './entities/JobRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, JobRequest])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
