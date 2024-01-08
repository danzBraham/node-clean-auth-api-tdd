const GetAuthenticationUseCase = require('../../../../Applications/use_case/GetAuthenticationUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const getAuthenticationUseCase = this._container.getInstance(GetAuthenticationUseCase.name);
    const tokens = await getAuthenticationUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: { ...tokens },
    });
    response.code(201);
    return response;
  }
}

module.exports = AuthenticationsHandler;
