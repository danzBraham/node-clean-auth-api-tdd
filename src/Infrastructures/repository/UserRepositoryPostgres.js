const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/user/entities/RegisteredUser');
const UserRepository = require('../../Domains/user/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator, passwordHash) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._passwordHash = passwordHash;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username unavailable');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('The credentials you provided are incorrect');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await this._passwordHash.check(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Invalid password');
    }

    return id;
  }
}

module.exports = UserRepositoryPostgres;
