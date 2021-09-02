import { hash, compare } from 'bcryptjs';
import { verify, sign } from 'jsonwebtoken';

import { IDecodeTokenResponseDTO } from '../dtos/IHashProviderDTO';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }

  decodeToken<T extends IDecodeTokenResponseDTO>(token: string, secret: string): T {
    const decoded = verify(token, secret) as unknown as T;
    return decoded;
  }

  encodeToken(user_id: string, email: string, role: string, secret: string, expires_in: string): string {
    const token = sign({ email, role }, secret, {
      subject: user_id,
      expiresIn: expires_in,
    });
    return token;
  }
}

export default BCryptHashProvider;
