import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { JoiValidationSchema } from './config/joi.validation';
import { EnvConfiguration } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({ //DEBE ESTAR SIEMPRE PRIMERO porque carga la variable de entorno de la database
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }), 
    MongooseModule.forRoot(process.env.MONGODB),
    HttpModule,
    UsersModule,
    PostsModule,
    AdminModule, 
    CommonModule,
  ],
})
export class AppModule {}
