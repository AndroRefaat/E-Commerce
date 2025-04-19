


import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'confrimPassword', async: false })
export class confirmPassword implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments): boolean | Promise<boolean> {
        return confirmPassword === args.object['password'];
    }

    defaultMessage(args: ValidationArguments) {

        return 'password and confirm password must be the same!';
    }
}