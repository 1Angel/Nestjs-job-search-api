import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './Dtos/Create-JobPost.dto';
import { UpdateJobPostDto } from './Dtos/UpdateJobPostDto.dto';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post('create')
  CreateJobPost(@Body() createpostJobDto: CreateJobPostDto) {
    return this.jobPostService.CreateJobPost(createpostJobDto);
  }

  @Get('')
  FindAll() {
    return this.jobPostService.FindAll();
  }

  @Get('/:id')
  FindById(@Param('id') id: number) {
    return this.jobPostService.FindById(id);
  }

  @Delete('delete/:id')
  DeleteById(@Param('id') id: number) {
    return this.jobPostService.DeleteById(id);
  }

  @Put('update/:id')
  UpdatePost(
    @Param('id') id: number,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ) {
    return this.jobPostService.UpdatePost(id, updateJobPostDto);
  }
}
