import { IDecodeTokenResponseDTO } from '../dtos/IHashProviderDTO';

interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
  decodeToken<T extends IDecodeTokenResponseDTO>(token: string, secret: string): T;
  encodeToken(user_id: string, email: string, role: string, secret: string, expires_in: string): string;
}
export { IHashProvider };
