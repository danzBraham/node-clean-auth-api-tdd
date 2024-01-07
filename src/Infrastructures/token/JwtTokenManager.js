const TokenManager = require('../../Applications/token/TokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends TokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async generateAccessToken(payload) {
    return this._jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async generateRefreshToken(payload) {
    return this._jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const artifacts = this._jwt.token.decode(refreshToken);
      this._jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Invalid refresh token');
    }
  }
}

module.exports = JwtTokenManager;
