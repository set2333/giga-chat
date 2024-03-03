export const AUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

export const MESSAGE_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

export const TOKEN_COUNT_URL = 'https://gigachat.devices.sberbank.ru/api/v1/tokens/count';

export const GET_MODELS_URL = 'https://gigachat.devices.sberbank.ru/api/v1/models';

export const MODELS = {
  GigaChat: 'GigaChat',
  GigaChatLatest: 'GigaChat:latest',
  GigaChatPlus: 'GigaChat-Plus',
  GigaChatPro: 'GigaChat-Pro',
};

export const ROLES = {
  ASSISTANT : 'assistant ',
  SEARCH_RESULT: 'search_result',
  SYSTEM: 'system',
  USER: 'user',
};