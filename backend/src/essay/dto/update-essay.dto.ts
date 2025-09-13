import { PartialType } from '@nestjs/mapped-types';
import { CreateEssayDto } from './create-essay.dto';

export class UpdateEssayDto extends PartialType(CreateEssayDto) {}
