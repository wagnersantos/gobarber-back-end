import { uuid } from 'uuidv4';

import UserToken from 'modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository {
  private usersToken: UserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.usersToken.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersToken.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }
}

export default FakeUserTokenRepository;
