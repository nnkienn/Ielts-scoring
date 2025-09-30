import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/guard/get-user.decorator';
import { JwtGuard } from 'src/common/decorators/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

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
    @UseGuards(JwtGuard)
    @Post('change-password')
    async changePassword(
      @GetUser('sub') userId: number,
      @Body() dto: ChangePasswordDto,
    ) {
      return this.usersService.changePassword(userId, dto);
    }
  

  @Delete()
  remove(@GetUser('sub') userId: number) {
    return this.usersService.removeUser(userId);
  }
}
