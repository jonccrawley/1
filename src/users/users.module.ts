import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheService } from './cache.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CacheService],
  exports: [UsersService],
})
export class UsersModule {}