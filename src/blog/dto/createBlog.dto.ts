import { IsNotEmpty, IsArray } from 'class-validator'
import { Category, Tags } from '../../interfaces'

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsArray()
  categories: Category[];

  @IsNotEmpty()
  @IsArray()
  tags: Tags[]
}
