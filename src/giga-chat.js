import https from 'https';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { AUTH_URL, GET_MODELS_URL, MESSAGE_URL, MODELS, ROLES, TOKEN_COUNT_URL } from './consts.js';

const defaultMessageOptions = {
  "model": MODELS.GigaChatLatest,
  "temperature": 1.0,
  "top_p": 0.1,
  "n": 1,
  "stream": false,
  "max_tokens": 512,
  "repetition_penalty": 1,
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export class GigaChat {
  authToken = null;
  accessToken = null;
  expiresAt = null;
  uid = null;
  messages = [];
  messageOptions = {};

  constructor(options) {
    this.uid = uuidv4();
    this.authToken = options.authToken;
    this.messageOptions = {
       ...defaultMessageOptions,
      ...(options.messageOptions ? { ...options.messageOptions } : {}),
    };
    this.messages = options?.initMessages ? [...options.initMessages] : [];
  }

  async auth() {
    if (!this.accessToken || !this.expiresAt) {
      const responce = await fetch(AUTH_URL, {
        agent: httpsAgent,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'RqUID': this.uid,
          'Authorization': `Basic ${this.authToken}`,
        },
        body:'scope=GIGACHAT_API_PERS',
      });
      const { access_token, expires_at } = await responce.json();
      this.accessToken = access_token;
      this.expiresAt = expires_at;
    }
  }

  async send(content) {
    await this.auth();

    this.messages.push({ role: ROLES.USER, content });
    const response = await fetch(MESSAGE_URL, {
      agent: httpsAgent,
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        ...this.messageOptions,
        messages: this.messages,
      }),
    });
    try {
      const json = await response.json();
      this.messages.push(json?.choices?.[0]?.message);
    
      return json?.choices?.[0]?.message?.content;
    } catch (e) {
      return text.join(' ');
    }
  }

  async getTokenCount() {
    await this.auth();
    const response = await fetch(TOKEN_COUNT_URL, {
      agent: httpsAgent,
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        model: this.messageOptions.model,
        input: this.messages.map(({ content }) => content),
      }),
    });
    const json = await response.json();

    return  json.reduce((acc, { tokens, characters }) => ({
      tokens: tokens + (acc.tokens ?? 0),
      characters: characters + (acc.characters ?? 0),
    }), {});
  }

  async getModels() {
    await this.auth();
    const response = await fetch(GET_MODELS_URL, {
      agent: httpsAgent,
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    return await response.text();
  }
}