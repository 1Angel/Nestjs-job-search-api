import {
  Injectable,
  NotFoundException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobPostDto } from './Dtos/Create-JobPost.dto';
import { JobPost } from './entities/JobPost.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { UpdateJobPostDto } from './Dtos/UpdateJobPostDto.dto';
import { JobRequest } from './entities/JobRequest.entity';
import { CreateJobRequestDto } from './Dtos/Create-jobRequest.Dto';
import { User } from 'src/auth/entity/User.entity';
import { SearchFilterDto } from './Dtos/SearchFilterDto.dto';
import { PaginationDto } from './Dtos/PaginationDto.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private JobPostRepository: Repository<JobPost>,

    @InjectRepository(JobRequest)
    private JobRequestRepository: Repository<JobRequest>,
  ) {}

  /*  BASIC CRUD FOR JOBPOST ENTITY */

  async CreateJobPost(createpostJobDto: CreateJobPostDto, user: User) {
    const post = this.JobPostRepository.create({
      ...createpostJobDto,
      user: user,
    });
    return this.JobPostRepository.save(post);
  }

  FindAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const job = this.JobPostRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
      relations: { jobrequest: true, user: true },
    });
    if (!job) {
      throw new NotFoundException('not job found');
    }
    return job;
  }

  FindAllByTitle(
    searchFilterDto: SearchFilterDto,
    paginationDto: PaginationDto,
  ) {
    const { title } = searchFilterDto;
    const { limit = 10, offset = 0 } = paginationDto;

    const job = this.JobPostRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
      relations: { user: true },
      where: [
        {
          title: Like(`%${title}%`),
        },
      ],
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

  //only the user who create the post can see who has send job-request
  async SeePostById(id: number, user: User) {
    const post = await this.JobPostRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
        jobrequest: {
          user: true,
        },
      },
    });

    if (post.id !== user.id) {
      throw new UnauthorizedException();
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

  async UpdatePost(id: number, updateJobPostDto: UpdateJobPostDto, user: User) {
    const postid = await this.JobPostRepository.findOneBy({ id });
    if (!postid) {
      throw new NotFoundException(`post with the id ${id} not found`);
    }

    if (postid.id !== user.id) {
      throw new UnauthorizedException();
    }

    const post = await this.JobPostRepository.update(id, updateJobPostDto);
    return post;
  }

  /* JOBREQUEST BASIC CRUD */
  async CreateJobRequest(
    jobPostId: number,
    createJobRequestDto: CreateJobRequestDto,
    user: User,
    file: Express.Multer.File,
  ) {
    const jobpostID = await this.JobPostRepository.findOneById(jobPostId);

    const createRequest = await this.JobRequestRepository.create({
      ...createJobRequestDto,
      jobPost: jobpostID,
      user: user,
      fileCV: file.filename,
    });

    return this.JobRequestRepository.save(createRequest);
  }

  async JobRequestByid(id: number) {
    const requestById = await this.JobRequestRepository.find({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
    return requestById;
  }
}
