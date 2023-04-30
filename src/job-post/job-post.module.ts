import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/JobPost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
