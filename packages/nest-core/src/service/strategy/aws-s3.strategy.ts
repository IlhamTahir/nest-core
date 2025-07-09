import { UploadStrategy } from './upload-strategy.interface';
import {
  CompleteMultipartUploadCommand,
  GetObjectCommand,
  ListPartsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class AwsS3Strategy implements UploadStrategy {
  private sts: STSClient;
  private s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  constructor() {
    this.sts = new STSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = process.env.AWS_BUCKET;
    this.region = process.env.AWS_REGION;
  }

  async initUpload() {
    // 获取 STS 临时凭证
    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ARN,
      RoleSessionName: 'upload-session',
      DurationSeconds: 3600,
    });
    const stsResponse = await this.sts.send(assumeRoleCommand);
    const credentials = stsResponse.Credentials;
    return {
      bucket: this.bucket,
      region: this.region,
      credentials: {
        accessKeyId: credentials!.AccessKeyId!,
        secretAccessKey: credentials!.SecretAccessKey!,
        sessionToken: credentials!.SessionToken!,
        expiration: credentials!.Expiration!.toISOString(),
      },
    };
  }

  async finishUpload(
    uploadId: string,
    bucket: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: '<file-name>',
      UploadId: uploadId,
      MultipartUpload: {
        Parts: [
          /* 已完成分片信息 */
        ],
      },
    });

    const response = await this.s3.send(completeCommand);

    return {
      filePath: response.Key!,
      fileUrl: response.Location!,
    };
  }

  async resumeUpload(
    uploadId: string,
    bucket: string,
  ): Promise<{ completedParts: { partNumber: number; eTag: string }[] }> {
    const command = new ListPartsCommand({
      Bucket: bucket,
      Key: uploadId,
      UploadId: uploadId,
    });

    const response = await this.s3.send(command);

    return {
      completedParts: response.Parts!.map((part) => ({
        partNumber: part.PartNumber!,
        eTag: part.ETag!,
      })),
    };
  }

  async generateUrl(key: string): Promise<string> {
    // 生成文件访问 URL
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
