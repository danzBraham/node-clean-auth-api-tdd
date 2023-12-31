const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action and Assert
    await expect(userRepository.addUser({})).rejects.toThrow(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(userRepository.verifyAvailableUsername('')).rejects.toThrow(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
