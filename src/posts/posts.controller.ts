import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoid.pipe';
import { Auth } from 'src/users/decorators/auth.decorator';
import { ValidRoles } from 'src/users/interfaces/validRoles';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Post as Posted } from './entities/post.entity';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth(ValidRoles.user)
  @ApiResponse({status:201, description: 'Post was updated', type: Posted })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User
    ) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({status:201, description: 'Get all Posts succesfull', type: Posted })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  findAll( @Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  @ApiResponse({status:201, description: 'Get a Post succesfull', type: Posted , schema:{example: '658c37990984d00d3cb492cd'} })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  findOne(@Param('term') term: string) {
    return this.postsService.findOne(term);
  }

  @Get('search/:term')
  @Auth()
  @ApiResponse({status:201, description: 'Search Posts succesfull', type: Posted , schema:{examples: ['658c37990984d00d3cb492cd ','my blog'] }})
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  search(
    @Param('term') term: string, 
    @Query() paginationDto: PaginationDto){
     return this.postsService.search(term, paginationDto);
  }

  @Get('filter/:term')
  @Auth()
  @ApiResponse({status:201, description: 'Filter Posts succesfull', type: Posted , schema:{examples: ['658c37990984d00d3cb492cd ','my blog'] }})
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  filter(@Param('term') term: string){
     return this.postsService.filter(term);
  }

  @Get('user/:userId')
  @Auth()
  @ApiResponse({status:201, description: 'Get Posts by UserId succesfull', type: Posted , schema:{examples: ['658c37990984d00d3cb492cd'] }})
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  getPostsByUserId(@Param('userId', ParseMongoIdPipe) userId: string) {
    const posts = this.postsService.getPostsByUserId(userId);
    return posts;
  }

  @Patch(':term')
  @Auth(ValidRoles.admin , ValidRoles.user)
  @ApiResponse({status:201, description: 'Post updated succesfull', type: Posted })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  update(
    @Param('term') term: string, 
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User) {
    return this.postsService.update(term, updatePostDto, user);
  }

  
  @Delete(':id')
  @Auth(ValidRoles.admin , ValidRoles.user)
  @ApiResponse({status:201, description: 'Post deleted succesfull', type: Posted })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.postsService.remove(id);
  }
}
