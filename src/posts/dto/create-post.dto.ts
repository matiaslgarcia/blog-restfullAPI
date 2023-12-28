import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString, MinLength } from "class-validator";

export class CreatePostDto {

    @ApiProperty({
        description: 'Post title',
        nullable: false,
        minimum: 1
    })
    @IsString()
    @MinLength(1)
    title?: string;
    
    @ApiProperty({
        description: 'Post author',
        nullable: false,
        minimum: 1
    })
    @IsString()
    @MinLength(1)
    author?: string;
    
    @ApiProperty({
        description: 'Post content',
        nullable: false,
        minimum: 1
    })
    @IsString()
    @MinLength(1)
    content?: string;
    
    @ApiProperty({
        description: 'Post categories',
        nullable: false,
        minimum: 1
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true})
    categories?: string[];
}
