import { Api } from './api';
import { Danny } from './danny';

export class Installation {
  static poller() {
    return Api.invoke<Danny>('/danny');
  }

  static connect() {
    return Api.invoke<Danny>('/danny/connect', { method: 'POST' });
  }

  static start() {
    return Api.invoke<Danny>('/danny/start', { method: 'POST' });
  }

  static stop() {
    return Api.invoke<Danny>('/danny/stop', { method: 'POST' });
  }
}
