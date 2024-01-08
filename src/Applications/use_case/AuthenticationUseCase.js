class AuthenticationUseCase {
  constructor({ authenticationRepository, userRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
  }

  async getAuthentication(useCasePayload) {
    this._verifyUseCasePayload(useCasePayload);
    const { username, password } = useCasePayload;
    const id = await this._userRepository.verifyUserCredential(username, password);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });
    await this._authenticationRepository.addRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }

  _verifyUseCasePayload({ username, password }) {
    if (!username || !password) {
      throw new Error('GET_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('GET_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AuthenticationUseCase;
