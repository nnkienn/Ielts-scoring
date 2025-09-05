import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/guard/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get('me')
  async me(@GetUser('sub') userId: number) {
    return this.usersService.findOne(userId);
  }
  @Patch('update')
  update(@GetUser('sub') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete()
  remove(@GetUser('sub') userId: number) {
    return this.usersService.removeUser(userId);
  }
}
