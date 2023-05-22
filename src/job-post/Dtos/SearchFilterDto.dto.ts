import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchFilterDto {
  @IsOptional()
  @Type(() => String)
  title?: string;
}
