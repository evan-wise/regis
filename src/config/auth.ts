import { promises as fs } from 'fs';

const filePath = './auth.json';

export class Auth {
  discord: { botUserToken: string };
  postgres: { connectionString: string };
  static load = async () => JSON.parse(await fs.readFile(filePath, 'utf-8')) as Auth;
}
