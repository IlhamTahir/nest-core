import { randomBytes } from 'crypto';

export function generateUniqueKey(originalName: string): string {
  const ext = originalName.split('.').pop(); // 获取文件扩展名
  const randomString = randomBytes(8).toString('hex'); // 生成 16 位随机字符串
  return `${Date.now()}-${randomString}.${ext}`; // 组合成唯一文件名
}
