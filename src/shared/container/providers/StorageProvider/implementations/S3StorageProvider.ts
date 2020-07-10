import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';

import AppError from 'shared/errors/AppError';
import uploadConfig from 'config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new AppError('File not Found');
    }

    this.client.putObject(
      {
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      },
      () => {
        throw new AppError('Error upload file');
      },
    );

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    this.client.deleteObject(
      {
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      },
      () => {
        throw new AppError('Error delete file');
      },
    );
  }
}
