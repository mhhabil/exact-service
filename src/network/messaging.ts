import { AlyaMessage } from "@gic-indonesia/messaging-socket";
import { Application } from "express";
const fs = require('fs');
const path = require("path");

export default class MessagingService {
  app: any;

  constructor(app: Application) {
    this.app = app;
    this.connect();
  }

  async sendMessage(dest: string, path: string, body: any) {
    const message = new AlyaMessage();
    message.create({
      to: dest,
      path,
      body,
    });
    const result = await this.app.wsSend(message);
    if (result) {
      return result;
    } else {
      return undefined;
    }
  }

  emit(room: string, event: string, payload: any) {
    this.app.wsEmitTo(room, event, payload);
  }

  connect() {
    this.app.ws('/clear_word_templates', async function(message: AlyaMessage): Promise<AlyaMessage> {
      const body = message.getBody();
      if (message !== undefined) {
        fs.rmSync(path.resolve(__dirname, `docs/${body.branch_code}`), { recursive: true, force: true });
      }
      message.setBody({
        message: 'OK',
      })
      return message;
    });
    console.log('Messaging Service Ready...');
  }
}

