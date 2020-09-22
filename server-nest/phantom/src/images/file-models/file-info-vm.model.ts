import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileInfoVm {
  @ApiProperty()
  @Expose()
  length: number;

  @ApiProperty()
  @Expose()
  chunkSize: number;

  @ApiProperty()
  @Expose()
  filename: string;

  @ApiProperty()
  @Expose()
  md5: string;

  @ApiProperty()
  @Expose()
  contentType: string;
}
