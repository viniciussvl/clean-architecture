import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { AccountRepository } from '../../../infra/db/mongodb/repositories/account/account-repository'
import { LogRepository } from '../../../infra/db/mongodb/repositories/log/log-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountRepository = new AccountRepository()
    const authentication = new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository)
    const validationComposite = makeLoginValidation()
    const loginController = new LoginController(authentication, validationComposite)
    const logRepository = new LogRepository()
    return new LogControllerDecorator(loginController, logRepository)
}
