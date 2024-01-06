class TokenManager {
  async generateAccessToken(payload) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async generateRefreshToken(payload) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(payload) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = TokenManager;
