import SnowflakeID from 'snowflake-id';

export class SnowflakeUtil {
  private static instance: SnowflakeID;

  static initialize(workerId: number = 1, datacenterId: number = 1): void {
    this.instance = new SnowflakeID({
      workerId, // 机器 ID
      datacenterId, // 数据中心 ID
    });
  }

  static generateId(): string {
    if (!this.instance) {
      throw new Error('SnowflakeUtil is not initialized.');
    }
    return this.instance.generate().toString();
  }
}
