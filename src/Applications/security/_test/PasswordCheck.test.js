const PasswordCheck = require('../PasswordCheck');

describe('PasswordCheck interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordCheck = new PasswordCheck();

    // Action & Assert
    await expect(passwordCheck.check('dummy_password', 'svnwagui3wvnekvnn')).rejects.toThrow('PASSWORD_CHECK.METHOD_NOT_IMPLEMENTED');
  });
});
