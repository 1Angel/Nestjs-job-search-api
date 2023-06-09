import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './Dtos/Create-JobPost.dto';
import { UpdateJobPostDto } from './Dtos/UpdateJobPostDto.dto';
import { CreateJobRequestDto } from './Dtos/Create-jobRequest.Dto';
import { GetUser } from 'src/auth/Decorators/user.decorator';
import { User } from 'src/auth/entity/User.entity';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { SearchFilterDto } from './Dtos/SearchFilterDto.dto';
import { PaginationDto } from './Dtos/PaginationDto.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  CreateJobPost(
    @Body() createpostJobDto: CreateJobPostDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.CreateJobPost(createpostJobDto, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  FindAll(@Query() paginationDto: PaginationDto) {
    return this.jobPostService.FindAll(paginationDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all-titulo')
  FindAlltile(
    @Query() searchFilterDto: SearchFilterDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.jobPostService.FindAllByTitle(searchFilterDto, paginationDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  FindById(@Param('id') id: number) {
    return this.jobPostService.FindById(id);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  DeleteById(@Param('id') id: number) {
    return this.jobPostService.DeleteById(id);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  UpdatePost(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ) {
    return this.jobPostService.UpdatePost(id, updateJobPostDto, user);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user-post/:id')
  SeePostByIdCreatorOnly(@Param('id') id: number, @GetUser() user: User) {
    return this.jobPostService.SeePostById(id, user);
  }

  @UseGuards(AuthGuard)
  @Post('create-jobrequest/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../files/cvUser',
        filename(req, file, callback) {
          const extension = file.mimetype.split('/')[1];
          const fileName = `${uuid()}.${extension}`;

          callback(null, fileName);
        },
      }),
    }),
  )
  CreateJobRequest(
    @Param('id') jobPostId: number,
    @Body() createJobRequestDto: CreateJobRequestDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.jobPostService.CreateJobRequest(
      jobPostId,
      createJobRequestDto,
      user,
      file,
    );
  }

  @Get('upload/:imageName')
  StreamFileCV(
    @Res({ passthrough: true }) res: Response,
    @Param('imageName') imageName: string,
  ) {
    const file = createReadStream(
      join(process.cwd(), '../files/cvUser', imageName),
    );
    res.set({
      'Content-Type': 'text/plain',
    });
    return new StreamableFile(file);
  }

  @UseGuards(AuthGuard)
  @Get('job-request/:id')
  JobRequestById(@Param('id') id: number) {
    return this.jobPostService.JobRequestByid(id);
  }
}
