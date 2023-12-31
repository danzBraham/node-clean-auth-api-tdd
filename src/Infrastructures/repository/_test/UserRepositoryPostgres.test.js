const bcrypt = require('bcrypt');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const RegisterUser = require('../../../Domains/user/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/user/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('danzbraham')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('danzbraham')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      });
      const fakeIdGenerator = () => 123;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      });
      const fakeIdGenerator = () => 123;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'danzbraham',
        fullname: 'Zidan Abraham',
      }));
    });
  });

  describe('verifyUserCredential', () => {
    it('should throw AuthenticationError when credentials are incorrect', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, bcryptPasswordHash);

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUserCredential('random', 'password')).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError when password are incorrect', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham', password: 'secret' });
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, bcryptPasswordHash);

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUserCredential('danzbraham', 'password')).rejects.toThrow(AuthenticationError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham', password: 'secret' });
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, bcryptPasswordHash);

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUserCredential('danzbraham', 'secret')).resolves.toEqual('user-123');
    });
  });
});
