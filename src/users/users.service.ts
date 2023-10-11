import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ObjectID from 'bson-objectid';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const objId = new ObjectID();
    try {
      const create = await this.prisma.users.create({
        data: {
          ...createUserDto,
          id: objId.toHexString(),
        },
      });
      return create;
    } catch (error) {
      console.error(error);
      throw new HttpException('could not create user', HttpStatus.CONFLICT);
    }
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findFirst({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({ where: { id: id }, data: updateUserDto });
  }

  remove(id: string) {
    const deleteUser = { deletedAt: new Date() };
    return this.prisma.users.update({ where: { id: id }, data: deleteUser });
  }
}
