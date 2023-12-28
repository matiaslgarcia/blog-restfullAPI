import { Controller, Get, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/validRoles';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoid.pipe';
import { PostsService } from 'src/posts/posts.service';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UsersService } from 'src/users/users.service';


@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(PostsService)
    private readonly postService: PostsService,
    @Inject(UsersService)
    private readonly userService: UsersService
  ) { }

  @Get('users')
  @Auth(ValidRoles.admin)
  async findAll() {
    return this.userService.findAll();
  }

  @Delete('users/:id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id);
  }

  @Get('posts')
  @Auth(ValidRoles.admin)
  async getAllPosts(@Query() paginationDto: PaginationDto) {
    const posts = await this.postService.findAll(paginationDto);
    return posts;
  }

  @Patch('/:term')
  @Auth(ValidRoles.admin)
  async updatePost(
    @Param('term') term: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postService.updateAdmin(term, updatePostDto)
  };

  @Delete('/:term')
  @Auth(ValidRoles.admin)
  async deletePost(@Param('term') term: string) {
    await this.postService.removeAdmin(term);
  }

}
