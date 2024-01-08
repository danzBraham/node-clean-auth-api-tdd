/* istanbul ignore file */
const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./token/JwtTokenManager');

// use case
const AuthenticationRepository = require('../Domains/authentication/AuthenticationRepository');
const UserRepository = require('../Domains/user/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const TokenManager = require('../Applications/token/TokenManager');
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const GetAuthenticationUseCase = require('../Applications/use_case/GetAuthenticationUseCase');

// creating container
const container = createContainer();

// registering repository and services
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
        { name: 'passwordHash', internal: PasswordHash.name },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [{ concrete: bcrypt }],
    },
  },
  {
    key: TokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{ concrete: Jwt }],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'passwordHash', internal: PasswordHash.name },
      ],
    },
  },
  {
    key: GetAuthenticationUseCase.name,
    Class: GetAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'tokenManager', internal: TokenManager.name },
      ],
    },
  },
]);

module.exports = container;
