class AuthenticationUseCase {
  constructor({ authenticationRepository, userRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
  }

  _verifyGetUseCasePayload({ username, password }) {
    if (!username || !password) {
      throw new Error('GET_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('GET_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async getAuthentication(useCasePayload) {
    this._verifyGetUseCasePayload(useCasePayload);
    const { username, password } = useCasePayload;
    const id = await this._userRepository.verifyUserCredential(username, password);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });
    await this._authenticationRepository.addRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }

  _verifyPutUseCasePayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('PUT_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('PUT_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async putAuthentication(useCasePayload) {
    this._verifyPutUseCasePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.verifyRefreshToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    return { accessToken };
  }
}

module.exports = AuthenticationUseCase;
