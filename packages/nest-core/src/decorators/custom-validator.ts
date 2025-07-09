import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUsernameOrEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // 检查是否为有效邮箱
          const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          const isEmail = emailRegex.test(value);

          // 如果不是邮箱，检查是否为有效用户名
          if (!isEmail) {
            // 用户名规则：3-20 个字符，字母、数字、下划线
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            return usernameRegex.test(value);
          }

          return true;
        },

        defaultMessage() {
          return 'identifier 必须是有效的邮箱或用户名（3-20 个字符，字母、数字、下划线）';
        },
      },
    });
  };
}
