import { promises as fs } from 'fs';
import { Auth } from "./auth.model";

export class AuthLoader {
  static filePath = './auth.json';
  static async load() {
    const raw = await fs.readFile(AuthLoader.filePath, 'utf-8');
    return JSON.parse(raw) as Auth;
  }
}