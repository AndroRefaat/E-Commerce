
import { ZodSchema } from "zod";
import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.password !== value.confirmPassword) {
            throw new HttpException('Passwords do not match', 422);
        }
    }
}
