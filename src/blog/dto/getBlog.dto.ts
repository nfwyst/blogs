import { IsOptional, IsNumberString } from 'class-validator'

export class getAllBlogCategoriesTagsDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsNumberString()
  skip: string;
}
