import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() { 
    const findAllUsers = await this.usersService.findAll();
    if (findAllUsers) return findAllUsers;
    throw new NotFoundException('Usre Not Found');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findById = await this.usersService.findOne(id);
    if (findById) return findById;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUser = await this.usersService.update(id, updateUserDto);
    if (updateUser) return updateUser;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteUser = await this.usersService.remove(id);
    if (deleteUser) return deleteUser;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }
}
