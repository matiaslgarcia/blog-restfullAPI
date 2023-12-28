import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document , Schema as MongooseSchema} from 'mongoose';
import { Post } from 'src/posts/entities/post.entity';

@Schema()
export class User extends Document {

    @ApiProperty({
        example: 'matiaslgarcia',
        description: 'Username user',
        uniqueItems: true
    })
    @Prop({
        type: String,
        unique: true,
        index: true,
        required: true,
    })
    username: string;

    @ApiProperty({
        example: 'matiasGarcia1234',
        description: 'Password user',
        uniqueItems: true
    })
    @Prop({
        type: String,
        required: true, 
        })
    password: string;

    @ApiProperty({
        example: 'matiasgarcia444@gmail.com',
        description: 'Email user',
        uniqueItems: true
    })
    @Prop({
        type: String,
        unique: true,
        index: true,
        required: true,
    })
    email: string;

    @ApiProperty({
        example: 'true',
        description: 'If user is active or not',
        uniqueItems: true
    })
    @Prop({
        type:Boolean,
        default:true,
    })
    isActive: boolean;

    @ApiProperty({
        example: 'user',
        description: 'Role user, by default is user, but can be "admin"',
        uniqueItems: true
    })
    @Prop({
        required: true,
        default: ['user'],
        type: Array 
    })
    roles: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }] })
    post: Post
}

export const UserSchema = SchemaFactory.createForClass(User);