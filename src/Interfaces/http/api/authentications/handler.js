const AuthenticationUseCase = require('../../../../Applications/use_case/AuthenticationUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name);
    const tokens = await authenticationUseCase.getAuthentication(request.payload);

    const response = h.response({
      status: 'success',
      data: { ...tokens },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name);
    const accessToken = await authenticationUseCase.putAuthentication(request.payload);

    const response = h.response({
      status: 'success',
      data: { ...accessToken },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name);
    await authenticationUseCase.deleteAuthentication(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Refresh token successfully removed',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
