import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminModule]
})
export class AdminModule { }
