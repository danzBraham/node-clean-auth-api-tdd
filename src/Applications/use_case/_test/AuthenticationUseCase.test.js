const AuthenticationRepository = require('../../../Domains/authentication/AuthenticationRepository');
const UserRepository = require('../../../Domains/user/UserRepository');
const TokenManager = require('../../token/TokenManager');
const AuthenticationUseCase = require('../AuthenticationUseCase');

describe('AuthenticationUseCase', () => {
  describe('getAuthentication', () => {
    // creating dependancy of use case
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    // creating use case instance
    const authenticationUseCase = new AuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
    });

    it('should throw error when useCasePayload did not contain needed property', async () => {
    // Arrange
      const useCasePayload = {
        username: 'danzbraham',
      };

      // Action and Assert
      await expect(authenticationUseCase.getAuthentication(useCasePayload)).rejects.toThrow('GET_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when useCasePayload did not meet data type specification', async () => {
    // Arrange
      const useCasePayload = {
        username: 123,
        password: 'secret',
      };

      // Action and Assert
      await expect(authenticationUseCase.getAuthentication(useCasePayload)).rejects.toThrow('GET_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the authentication user action correctly', async () => {
    // Arrange
      const useCasePayload = {
        username: 'danzbraham',
        password: 'secret',
      };
      const id = 'user-123';
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

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

      // Action
      const authenticatedUser = await authenticationUseCase.getAuthentication(useCasePayload);

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
});
