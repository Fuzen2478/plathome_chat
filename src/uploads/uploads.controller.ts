import { Controller, Post, UploadedFile } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { ApiFile } from 'src/common/decorators/api-file.decorator';

@Controller()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload')
  @ApiFile('file')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
