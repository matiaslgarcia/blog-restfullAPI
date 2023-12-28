import { ApiProperty } from "@nestjs/swagger";
import { IsString ,IsEmail, MinLength, MaxLength, Matches } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'User username',
        nullable: false,
        minimum: 1
    })
    @IsString()
    @MinLength(1)
    username: string;

    @ApiProperty({
        description: 'User password. The password must have a Uppercase, lowercase letter and a number',
        nullable: false,
        minimum: 6,
        maximum: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'User email',
        nullable: false,
        minimum: 1
    })
    @IsEmail()
    @MinLength(1)
    email: string;

}
