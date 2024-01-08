const DomainErrorTranslator = require('../DomainErrorTranslator');
const AuthenticationError = require('../AuthenticationError');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create a new user because the required properties are missing'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create a new user because the data type does not match'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('cannot create a new user because the username has more than 50 characters'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('cannot create a new user because the username contain restricted character'));

    expect(DomainErrorTranslator.translate(new Error('GET_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new AuthenticationError('cannot get authentication because the required properties are missing'));

    expect(DomainErrorTranslator.translate(new Error('GET_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new AuthenticationError('cannot get authentication because the data type does not match'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
