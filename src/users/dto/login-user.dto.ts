import { ApiProperty } from "@nestjs/swagger";
import { IsString ,IsEmail, MinLength, MaxLength, Matches } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'Login User username',
        nullable: false,
        minimum: 1
    })
    @IsEmail()
    @MinLength(1)
    email: string;
    
    @ApiProperty({
        description: 'Login User password. The password must have a Uppercase, lowercase letter and a number',
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

    
}
