import { PartialType } from '@nestjs/mapped-types';
import { CreateIndexingDto } from './create-indexing.dto';

export class UpdateIndexingDto extends PartialType(CreateIndexingDto) {}
