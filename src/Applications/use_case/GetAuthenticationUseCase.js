class GetAuthenticationUseCase {
  constructor({ authenticationRepository, userRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { username, password } = useCasePayload;
    const id = await this._userRepository.verifyUserCredential(username, password);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });
    await this._authenticationRepository.addRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }
}

module.exports = GetAuthenticationUseCase;
