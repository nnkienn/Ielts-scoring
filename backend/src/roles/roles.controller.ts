import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/common/guard/roles.decorator';

@Controller('admin/role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
