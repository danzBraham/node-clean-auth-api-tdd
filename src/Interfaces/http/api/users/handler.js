const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class UsersHandler {
  constructor(container) {
    this._container = container;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(request.payload);

      const response = h.response({
        status: 'success',
        data: { addedUser },
      });
      response.code(201);
      return response;
    } catch (error) {
      const transaltedError = DomainErrorTranslator.translate(error);

      const response = h.response({
        status: 'fail',
        message: transaltedError.message,
      });
      response.code(transaltedError.statusCode);
      return response;
    }
  }
}

module.exports = UsersHandler;
