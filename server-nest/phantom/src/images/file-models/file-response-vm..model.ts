import { ApiProperty } from '@nestjs/swagger';
import { FileInfoVm } from './file-info-vm.model';

export class FileResponseVm {
  @ApiProperty() message: string;

  @ApiProperty({ type: FileInfoVm })
  file: FileInfoVm;
}
