import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>,
  
  ) { }

  async create(createPostDto: CreatePostDto, user: User) {
    createPostDto.title = createPostDto.title.toLocaleLowerCase()

    try {
      const post = await this.postModule.create(
        { 
          ...createPostDto, 
          author: user._id 
        })

      user.post = post;
      await user.save();
      return post
    } catch (error) {
      this.handlerExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    return await this.postModule.find().limit(limit).skip(offset).sort({ no: 1 }).select('-__v')
  }

  async findOne(term: string) {
    let post: Post;

    if (!post && isValidObjectId(term)) {
      post = await this.postModule.findById(term)
    }

    if (!post) {
      post = await this.postModule.findOne({ title: term.toLowerCase().trim() })
    }

    if (!post) throw new NotFoundException(`Post with title or author "${term}" not found`);
    return post
  }

  async filter(term: string) {
    let post: Post;

    if (!post && isValidObjectId(term)) {
      post = await this.postModule.findOne({ author: term })
    }
    
    if (!post) {
      post = await this.postModule.findOne({ categories: { $in: [term] } });
    }

    if (!post) throw new NotFoundException(`Post with category or author "${term}" not found`);
    return post
  }

  async search(term: string, paginationDto: PaginationDto) {
    let post: Post;

    const { limit = 10, offset = 0 } = paginationDto

    if (!post && isValidObjectId(term)) {
      post = await this.postModule.findById(term).limit(limit).skip(offset).sort({ no: 1 })
    }

    if (!post) {
      post = await this.postModule.findOne({ content: term }).limit(limit).skip(offset).sort({ no: 1 })
    }

    if (!post) {
      post = await this.postModule.findOne({ author: term }).limit(limit).skip(offset).sort({ no: 1 })
    }

    if (!post) {
      post = await this.postModule.findOne({ title: term.toLowerCase().trim()}).limit(limit).skip(offset).sort({ no: 1 })
    }

    if (!post) throw new NotFoundException(`Post with title or author or content "${term}" not found`);
    return post
  }

  async getPostsByUserId(userId: string) {
    try {
      const posts = await this.postModule.find({ 'author': userId }).exec();
      return posts;
    } catch (error) {
      throw new NotFoundException(`Posts for user with id ${userId} not found`);
    }
  }

  async update(term: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.findOne(term)
    if (!updatePostDto.title) {
      updatePostDto.title = updatePostDto.title.toLowerCase()
    }
    try {
      post.author = user
      await post.updateOne(updatePostDto)
      return { ...post.toJSON(), ...updatePostDto }
    } catch (error) {
      this.handlerExceptions(error)
    }
  }

  async updateAdmin(term: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(term)
    if (updatePostDto.title) {
      updatePostDto.title = updatePostDto.title.toLowerCase()
    }
    try {
      await post.updateOne(updatePostDto)
      return { ...post.toJSON(), ...updatePostDto }
    } catch (error) {
      this.handlerExceptions(error)
    }
  }

  async removeAdmin(id: string) {
    const { deletedCount } = await this.postModule.deleteOne({ _id: id })
    if (deletedCount === 0)
      throw new BadRequestException(`Post with "${id}" not found`)

    return;
  }

  async remove(id: string) {
    const { deletedCount } = await this.postModule.deleteOne({ _id: id })
    if (deletedCount === 0)
      throw new BadRequestException(`Post with "${id}" not found`)

    return;
  }

  private handlerExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Post exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't update Post - Check server logs`);
  }
}
