// file: aws-s3 > src > app.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private readonly s3: AWS.S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
    });
  }

  async uploadFile(file) {
    const { originalname } = file;
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    return await this.s3_upload(
      file.buffer,
      bucket,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    console.log('asdasd');
    const params = {
      Bucket: bucket,
      Key: `chat/${new Date()}_${String(name)}`,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const response = await this.s3.upload(params).promise();
      return response.Location;
    } catch (e) {
      console.log(e);
    }
  }
}
