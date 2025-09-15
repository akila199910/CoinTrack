import { IsString, Length, Matches, ValidateIf, IsDefined } from "class-validator";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function Match<T = any>(
  property: keyof T,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: "Match",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [keyof T];
          const relatedValue = (args.object as T)[relatedPropertyName];
          return typeof value !== "undefined" &&
                 typeof relatedValue !== "undefined" &&
                 value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string];
          return `${args.property} must match ${relatedPropertyName}.`;
        },
      },
    });
  };
}

const PASSWORD_COMPLEXITY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

export class SettingsDto {
  @IsDefined({ message: "Password is required when confirm password is provided." })
  @IsString()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters." })
  @Matches(PASSWORD_COMPLEXITY, {
    message:
      "Password must include at least one uppercase letter, one lowercase letter, and one symbol (e.g., @).",
  })
  password?: string;

  @IsDefined({ message: "Confirm password is required when password is provided." })
  @IsString()
  @Length(8, 20, { message: "Confirm password must be between 8 and 20 characters." })
  @Matches(PASSWORD_COMPLEXITY, {
    message:
      "Confirm password must include at least one uppercase letter, one lowercase letter, and one symbol (e.g., @).",
  })
  @Match<SettingsDto>("password", { message: "Passwords must match." })
  confirmPassword?: string;
}