import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateJobPostDto } from './Dtos/Create-JobPost.dto';
import { JobPost } from './entities/JobPost.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateJobPostDto } from './Dtos/UpdateJobPostDto.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private JobPostRepository: Repository<JobPost>,
  ) {}

  async CreateJobPost(createpostJobDto: CreateJobPostDto) {
    const post = this.JobPostRepository.create(createpostJobDto);
    return this.JobPostRepository.save(post);
  }

  FindAll() {
    const job = this.JobPostRepository.find({
      order: {
        id: 'ASC',
      },
    });
    if (!job) {
      throw new NotFoundException('not job found');
    }
    return job;
  }

  async FindById(id: number) {
    const post = await this.JobPostRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`post with the id ${id} not found`);
    }

    return post;
  }

  async DeleteById(id: number) {
    const post = await this.JobPostRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`post with the id ${id} not found`);
    } else {
      this.JobPostRepository.delete(id);
      return {
        StatusCode: HttpStatus.OK,
        msg: 'post delete successfully',
      };
    }
  }

  async UpdatePost(id: number, updateJobPostDto: UpdateJobPostDto) {
    const postid = await this.JobPostRepository.findOneBy({ id });
    if (!postid) {
      throw new NotFoundException(`post with the id ${id} not found`);
    }

    const post = await this.JobPostRepository.update(id, updateJobPostDto);
    return post;
  }
}
