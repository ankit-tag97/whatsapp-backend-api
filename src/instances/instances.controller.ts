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
import { InstancesService } from './instances.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { Client, NoAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode';

@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post('create')
  create(@Body() createInstanceDto: CreateInstanceDto) {
    return this.instancesService.createInstances(createInstanceDto);
  }

  @Get('getQr')
  async findAll() {
    let sessionData;
    const getAllInstance = await this.instancesService.findAll();

    if (getAllInstance) {
      return getAllInstance;
    } else {
      const client = new Client({
        authStrategy: new NoAuth(),
      });
      client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, { small: true });
        QRCode.toFile(
          './src/qr-images/file.png',
          qr,
          {
            errorCorrectionLevel: 'H',
          },
          function (err) {
            if (err) throw err;
            console.log('QR code saved!');
          },
        );
      });

      // // Save session values to the file upon successful auth
      // client.on('authenticated', (session) => {
      //   console.log('Authenticated as' + session);
      //   sessionData = session;
      //   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      //     if (err) {
      //       console.error(err);
      //     }
      //   });
      // });

      client.initialize();
    }
  }

  //send text msg
  // @Post('send-text')
  // async sendTextMessage(@Body() body: { number: string; message: string }) {
  //   try {
  //     const { number, message } = body;
  //     const result = await this.instancesService.sendTextMessage(
  //       number,
  //       message,
  //     );
  //     return { success: true, message: 'Message sent successfully', result };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Failed to send message',
  //       error: error.message,
  //     }; 
  //   } 
  // }

@Post('send-text')
async sendWhatsAppMessage(@Body() messageBody:{recipient: string, content: string }){
  const client =new  Client({})
  await client.initialize();

  const chat = await client.getChatById(messageBody.recipient)

  //Send Message
  chat.sendMessage(messageBody.content)

  

}

  // Send Media
  @Post('send-media')
  async sendMedia(@Body() body: { mediaUrl: string; recipient: string }) {
    const { mediaUrl, recipient } = body;
    return this.instancesService.sendMedia(mediaUrl, recipient);
    // return 'Media sent successfully!';
  }

  @Get('checkStatus')
  async check() {
    const client = new Client({
      authStrategy: new NoAuth(),
    });
    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
      QRCode.toFile(
        './src/qr-images/file.png',
        qr,
        {
          errorCorrectionLevel: 'H',
        },
        function (err) {
          if (err) throw err;
          console.log('QR code saved!');
        },
      );
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.initialize();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findOneUser = await this.instancesService.findOne(id);
    if (findOneUser) return findOneUser;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInstanceDto: UpdateInstanceDto,
  ) {
    const updateInstance = this.instancesService.update(id, updateInstanceDto);
    if (updateInstance) return updateInstance;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleteUser = this.instancesService.remove(id);
    if (deleteUser) return deleteUser;
    throw new NotFoundException(`User Not Found With This id ${id}`);
  }
}
