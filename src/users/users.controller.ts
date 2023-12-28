import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoid.pipe';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidRoles } from './interfaces/validRoles';
import { Auth } from './decorators/auth.decorator';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({status:201, description: 'User was created', type: User })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @ApiResponse({status:201, description: 'Login was success' })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto)
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiResponse({status:200, description: 'Get Users success' })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':term')
  @Auth()
  @ApiResponse({status:200, description: 'Get User by Id',  schema:{example: '658c37990984d00d3cb492cd'} })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  getUserById(@Param('term', ParseMongoIdPipe) term: string) {
    return this.usersService.findOneById(term);
  }

  @Patch(':term')
  @Auth(ValidRoles.admin , ValidRoles.user)
  @ApiResponse({status:200, description: 'User was updated', type: User })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  updateUser(@Param('term', ParseMongoIdPipe) term: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(term, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({status:200, description: 'User was deleted' })
  @ApiResponse({status:400, description: 'Bad Request' })
  @ApiResponse({status:403, description: 'Forbidden. Token related.'})
  removeUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
