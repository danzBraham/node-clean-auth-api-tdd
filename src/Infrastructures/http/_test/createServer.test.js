const pool = require('../../database/postgres/pool');
const TokenManager = require('../../../Applications/token/TokenManager');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  describe('When POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new user because the required properties are missing');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: true,
        fullname: ['Zidan Abraham'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new user because the data type does not match');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbrahamwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwkwk',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new user because the username has more than 50 characters');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'danz braham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create a new user because the username contain restricted character');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'danzbraham' });
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assertusername not available
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username unavailable');
    });

    it('should handle server error correctly', async () => {
      // Arrange
      const requestPayload = {
        username: 'danzbraham',
        password: 'secret',
        fullname: 'Zidan Abraham',
      };
      const server = await createServer({}); // fake container

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('there was a failure on our server');
    });
  });

  describe('When POST /authentications', () => {
    it('should response 201 and persisted token', async () => {
      // Arrange
      const username = 'danzbraham';
      const password = 'secret';
      await UsersTableTestHelper.addUser({ username, password });
      const requestPayload = { username, password };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 401 when credentials are incorrect', async () => {
      // Arrange
      const username = 'danzbraham';
      const password = 'secret';
      await UsersTableTestHelper.addUser({ username, password });
      const requestPayload = { username: 'invalid-username', password: 'invalid-password' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('The credentials you provided are incorrect');
    });

    it('should response 401 when password is invalid', async () => {
      // Arrange
      const username = 'danzbraham';
      const password = 'secret';
      await UsersTableTestHelper.addUser({ username, password });
      const requestPayload = { username, password: 'invalid-password' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Invalid password');
    });
  });

  describe('When PUT /authentications', () => {
    it('should response 200 and access token', async () => {
      // Arrange
      const tokenManager = container.getInstance(TokenManager.name);
      const refreshToken = await tokenManager.generateRefreshToken({ id: 'user-123' });
      const requestPayload = { refreshToken };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 401 when refresh token is invalid', async () => {
      // Arrange
      const refreshToken = 'refresh-token';
      const requestPayload = { refreshToken };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Invalid refresh token');
    });
  });

  describe('When DELETE /authentications', () => {
    it('should response 200 and send the right message', async () => {
      // Arrange
      const tokenManager = container.getInstance(TokenManager.name);
      const refreshToken = await tokenManager.generateRefreshToken({ id: 'user-123' });
      const requestPayload = { refreshToken };
      await AuthenticationsTableTestHelper.addToken({ token: refreshToken });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(tokens).toHaveLength(0);
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('Refresh token successfully removed');
    });

    it('should response 401 when refresh token is invalid', async () => {
      // Arrange
      const refreshToken = 'refresh-token';
      const requestPayload = { refreshToken };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Invalid refresh token');
    });
  });
});
