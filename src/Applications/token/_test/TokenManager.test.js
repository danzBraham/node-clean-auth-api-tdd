const TokenManager = require('../TokenManager');

describe('TokenManager', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();

    // Action and Assert
    await expect(tokenManager.generateAccessToken({})).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.generateRefreshToken({})).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('refresh_token')).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
