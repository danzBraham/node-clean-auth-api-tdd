const AuthenticationRepository = require('../../../Domains/authentication/AuthenticationRepository');
const UserRepository = require('../../../Domains/user/UserRepository');
const TokenManager = require('../../token/TokenManager');
const GetAuthenticationUseCase = require('../GetAuthenticationUseCase');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the authentication user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'danzbraham',
      password: 'secret',
    };
    const id = 'user-123';
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';

    // creating dependancy of use case
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    // mocking needed function
    mockUserRepository.verifyUserCredential = jest
      .fn()
      .mockImplementation(() => Promise.resolve(id));
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(refreshToken));
    mockAuthenticationRepository.addRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(refreshToken));

    // creating use case instance
    const getAuthenticationUseCase = new GetAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
    });

    // Action
    const authenticatedUser = await getAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(authenticatedUser).toStrictEqual({ accessToken, refreshToken });
    expect(mockUserRepository.verifyUserCredential).toHaveBeenCalledWith(
      useCasePayload.username,
      useCasePayload.password,
    );
    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledWith({ id });
    expect(mockTokenManager.generateRefreshToken).toHaveBeenCalledWith({ id });
    expect(mockAuthenticationRepository.addRefreshToken).toHaveBeenCalledWith(refreshToken);
  });
});
