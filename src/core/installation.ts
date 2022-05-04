import { Api } from './api';
import { Danny } from './danny';

export class Installation {
  static poller() {
    return Api.invoke<Danny>('/danny');
  }

  static connect() {
    return Api.invoke<Danny>('/danny/connect', { method: 'POST' });
  }
}
