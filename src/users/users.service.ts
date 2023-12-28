import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModule: Model<User>,

    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await this.userModule.create({
        ...userData,
        password: hashedPassword
      })

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.roles[0],
        post: user.post || null,
      };

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`User exists in db ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error)
      throw new InternalServerErrorException(`Can't create User - Check server logs`)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email , password } = loginUserDto
    const user = await this.userModule.findOne({ email }).select('password').exec();
    if (!user) {
      throw new UnauthorizedException(`User credentials are not valid - ${email}`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`User credentials are not valid - ${password}`);
    }

    return {
      id: user._id,
      token: this.getJwtToken({ id: user._id  })

    };
  }

  async findAll() {
    let users: User[]

    if (!users) {
      users = await this.userModule.find().lean().populate('post').exec();;
    }
    if (!users) throw new NotFoundException(`Users not found`)
    return users

  }

  async findOneById(term: string) {
    let user: User

    if (!user && isValidObjectId(term)) {
      user = await this.userModule.findById(term).populate('post').exec();;
    } else {
      user = await this.userModule.findOne({ $or: [{ username: term }, { email: term }] }).populate('post').exec();;
    }

    if (!user) throw new NotFoundException(`User with id, username or email ${term} not found`)

    return user
  }

  async update(term: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOneById(term)
    try {
      await user.updateOne(updateUserDto)
      return { ...user.toJSON(), ...updateUserDto }
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`User exists in db ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error)
      throw new InternalServerErrorException(`Can't create User - Check server logs`)
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModule.deleteOne({ _id: id })
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }
}
