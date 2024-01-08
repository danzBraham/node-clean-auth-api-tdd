const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

process.env.ACCESS_TOKEN_KEY = 'mock-access-token-key';
process.env.REFRESH_TOKEN_KEY = 'mock-access-refresh-key';

describe('JwtTokenManager', () => {
  describe('generateAccessToken', () => {
    it('should generate access token with jwt correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt);

      // Action
      const accessToken = await jwtTokenManager.generateAccessToken(payload);

      // Assert
      expect(typeof accessToken).toEqual('string');
      expect(spyGenerate).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with jwt correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt);

      // Action
      const accessToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(typeof accessToken).toEqual('string');
      expect(spyGenerate).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when refresh token is invalid', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);

      // Action and Assert
      await expect(jwtTokenManager.verifyRefreshToken('invalid-token')).rejects.toThrow(InvariantError);
    });

    it('should verify refresh token signature correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const payload = { id: 'user-123' };
      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Action
      const { id } = await jwtTokenManager.verifyRefreshToken(refreshToken);

      // Assert
      expect(id).toEqual('user-123');
    });
  });
});
