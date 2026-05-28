import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { FileStoragePort } from '../ports/file-storage.port';

@Injectable()
export class S3FileStorage implements FileStoragePort {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly config: ConfigService) {
    this.endpoint = config.get<string>('MINIO_ENDPOINT', 'http://localhost:9000');
    this.bucket = config.get<string>('MINIO_BUCKET', 'poc03-uploads');

    this.s3 = new S3Client({
      endpoint: this.endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin123'),
      },
      forcePathStyle: true, // requerido para MinIO
    });
  }

  // Computa SHA-256 incrementalmente (reutiliza técnica validada en POC-01)
  // y sube el buffer a MinIO en un solo paso
  async uploadAndHash(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const sha256Hash = hash.digest('hex');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.length,
        Metadata: { 'sha256-hash': sha256Hash },
      }),
    );

    return sha256Hash;
  }

  getPublicUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}
