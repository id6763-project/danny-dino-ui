export class Api {
  private static apiBase = 'http://localhost:3000/api/v1';

  static invoke<T>(url: string, init?: RequestInit) {
    return fetch(`${this.apiBase}${url}`, init).then(
      (res) => res.json() as unknown as T
    );
  }
}
