import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ObjectID from 'bson-objectid';
import { Client, MessageMedia } from 'whatsapp-web.js';
import axios from 'axios';
@Injectable()
export class InstancesService {
  private client: Client;
  constructor(private readonly prisma: PrismaService) {}

  async createInstances(createInstanceDto: CreateInstanceDto) {
    const objId = new ObjectID();
    try {
      const crceateInstance = await this.prisma.instance.createMany({
        data: {
          ...createInstanceDto,
          id: objId.toHexString(),
        },
      });
      console.log(crceateInstance);
      return crceateInstance;
    } catch (error) {
      console.error(error);
      throw new HttpException('could not create instance', HttpStatus.CONFLICT);
    }
  }

  //Send text msg
  async sendTextMessage(number: string, message: string) {
    try {
      const chat = await this.client.getChatById(number);
      await chat.sendMessage(message);
    } catch (error) {
      throw error;
    }
  }

  // Send Media
  async sendMedia(mediaUrl: string, recipient: string) {
    try {
      const response = await axios.post(
        'http://localhost:3333/instances/send-media',
        {
          recipient,
          type: 'image',
          media: mediaUrl,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findFirst({ where: { id } });
  }

  update(id: string, updateInstanceDto: UpdateInstanceDto) {
    return this.prisma.instance.update({
      where: { id: id },
      data: updateInstanceDto,
    });
  }

  remove(id: string) {
    const deleteInstances = { deletedAt: new Date() };
    return this.prisma.instance.update({
      where: { id: id },
      data: deleteInstances,
    });
  }
}
