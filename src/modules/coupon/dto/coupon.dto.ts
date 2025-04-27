import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ async: true })
export class IsToDateAfterFromDate implements ValidatorConstraintInterface {
    validate(toDate: Date, args: ValidationArguments) {
        if (toDate < args.object['fromDate']) {
            return false
        }
        return true
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'toDate must be after fromDate'
    }
}

@ValidatorConstraint({ async: true })
export class IsFromDateInFuture implements ValidatorConstraintInterface {
    validate(fromDate: Date, args: ValidationArguments) {
        return fromDate > new Date()
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'fromDate must be in the future'
    }
}

export class CreateCouponDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    code: string

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsPositive()
    @IsNotEmpty()
    amount: number

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @Validate(IsFromDateInFuture)
    fromDate: Date


    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @Validate(IsToDateAfterFromDate)
    toDate: Date
}


export class UpdateCouponDto {
    @IsString()
    @IsOptional()
    @Length(1, 10)
    code?: string

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsPositive()
    @IsOptional()
    amount?: number

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @Validate(IsFromDateInFuture)
    fromDate?: Date


    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @Validate(IsToDateAfterFromDate)
    toDate?: Date
}