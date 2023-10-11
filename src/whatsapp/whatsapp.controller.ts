import { Controller, Get } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';

const SESSION_FILE_PATH = './session.json';
const fs = require('fs');
@Controller('whatsapp')
export class WhatsappController {
  @Get('qr')
  async findAll() {
    // Load the session data if it has been previously saved
    let sessionData;
    if (fs.existsSync(SESSION_FILE_PATH)) {
      sessionData = require(SESSION_FILE_PATH);
    }

    // const allSessionObject = {};
    const client = new Client({
      puppeteer: {
        headless: true,
      },
      authStrategy: new LocalAuth({
        clientId: 'YOUR_CLIENT_ID',
      }),
    });

    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR code with your phone to authenticate');
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
      console.log('Client is ready !');
    });

    client.on('disconnected', () => {
      console.log('Client is disconnected !');
    });


    client.on('connection', (socket) => {
      console.log('a user connected', socket?.id);
      socket.on('disconnected', () => {
        console.log('user disconnected');
      });

      socket.on('connected', (data) => {
        console.log('connected to the server', data);
        socket.emit('hello', 'hello from server');
      });

      socket.on('createSession', (data) => {
        console.log(data);
      });
    });

    client.initialize();
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

    // client.on('message', async (message) => {
    //   console.log(message.body);
    //   message.reply('Hello Welcome To Msg97...!');
    // });

    // client.on('message', (message) => {
    //   if (message.body === '!ping') {
    //     message.reply('pong');
    //   }
    // });
  }
}
