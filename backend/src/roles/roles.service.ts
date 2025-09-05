import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prismaService : PrismaService){}

  create(createRoleDto: CreateRoleDto) {
    const {name} = createRoleDto
    return this.prismaService.role.create(
      {data: {
        name
      }
      }
    )
  }

  findAll() {
    return this.prismaService.role.findMany();
  }

  remove(id: number) {
    return this.prismaService.role.delete({where : {id}});
  }
}
