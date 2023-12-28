import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document , Schema as MongooseSchema} from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Post extends Document {

  @ApiProperty({
    example: 'My Blog',
    description: 'Post title'
  })
  @Prop({ 
    required: true,
    unique: true,
    index: true,
    type: String 
  })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;
  
  @ApiProperty({
    example: 'My Blog in 2024',
    description: 'Post content '
  })
  @Prop({
     required: true,
     type: String 
    })
  content: string;

  @ApiProperty({
    example: 'food',
    description: 'Post categories. For example: food, cars, etc. '
  })
  @Prop({ 
    type: [String],
    required: true,

  })
  categories: string[];

}

export const PostSchema = SchemaFactory.createForClass(Post);