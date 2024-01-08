const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addRefreshToken', () => {
    it('should add refresh token to database correctly', async () => {
      // Arrange
      const refreshToken = 'refresh-token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.addRefreshToken(refreshToken);

      // Assert
      const refreshTokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(refreshTokens).toHaveLength(1);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when the token is invalid', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action and Assert
      await expect(authenticationRepositoryPostgres.verifyRefreshToken(refreshToken))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should verify refresh token correctly', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      await AuthenticationsTableTestHelper.addToken({ token: refreshToken });
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action and Assert
      await expect(authenticationRepositoryPostgres.verifyRefreshToken(refreshToken)).resolves;
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete refresh token to database correctly', async () => {
      // Arrange
      const refreshToken = 'refresh-token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.deleteRefreshToken(refreshToken);

      // Assert
      const refreshTokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(refreshTokens).toHaveLength(0);
    });
  });
});
