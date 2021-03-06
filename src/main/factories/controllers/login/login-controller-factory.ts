import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../presentation/controllers/auth/login/login-controller'
import { makeDbAuthentication } from '../../usecases/account/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
    const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
    return makeLogControllerDecorator(loginController)
}
