export interface UploadStrategy {
  /**
   * 初始化上传任务
   * @param key
   * @returns 包含 UploadId 和客户端操作所需的临时凭证
   */
  initUpload(): Promise<{
    bucket: string;

    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      sessionToken: string;
      expiration: string;
    };
  }>;

  /**
   * 恢复上传任务
   * @param uploadId 上传任务的唯一标识
   * @param bucket 存储桶名称
   * @returns 已完成分片的信息
   */
  resumeUpload(
    uploadId: string,
    bucket: string,
  ): Promise<{
    completedParts: { partNumber: number; eTag: string }[];
  }>;

  /**
   * 完成上传任务
   * @param uploadId 上传任务的唯一标识
   * @param bucket 存储桶名称
   * @returns 文件的存储路径和访问 URL
   */
  finishUpload(
    uploadId: string,
    bucket: string,
  ): Promise<{
    filePath: string;
    fileUrl: string;
  }>;

  generateUrl(key: string): Promise<string>;
}
