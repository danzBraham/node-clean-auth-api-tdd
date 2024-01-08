const AuthenticationError = require('./AuthenticationError');
const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot create a new user because the required properties are missing'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot create a new user because the data type does not match'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('cannot create a new user because the username has more than 50 characters'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('cannot create a new user because the username contain restricted character'),
  'GET_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new AuthenticationError('cannot get authentication because the required properties are missing'),
  'GET_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new AuthenticationError('cannot get authentication because the data type does not match'),
  'REFRESH_TOKEN_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new AuthenticationError('cannot get authentication because the required properties are missing'),
  'REFRESH_TOKEN_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new AuthenticationError('cannot get authentication because the data type does not match'),
};

module.exports = DomainErrorTranslator;
