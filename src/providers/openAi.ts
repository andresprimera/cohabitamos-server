import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAI {
  static api: any;
  constructor(private readonly config: ConfigService) {
    const OPENAI_API_KEY = this.config.get<string>('OPENAI_API_KEY', '');

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    OpenAI.api = new OpenAIApi(configuration);
  }

  get() {
    return OpenAI.api;
  }
}
