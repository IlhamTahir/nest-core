import dayjs from 'dayjs';

export class DateUtil {
  private static defaultFormat: string = 'YYYY-MM-DD HH:mm:ss';

  static toISOString(date: Date): string {
    return dayjs(date).toISOString();
  }

  static format(date: Date, format: string = this.defaultFormat): string {
    const formatted = dayjs(date).format(format);
    return formatted !== 'Invalid Date' ? formatted : '-';
  }

  static setDefaultFormat(format: string): void {
    this.defaultFormat = format;
  }
}
