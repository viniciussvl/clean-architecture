import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { AccountRepository } from '../../../infra/db/mongodb/repositories/account/account-repository'
import { LogRepository } from '../../../infra/db/mongodb/repositories/log/log-repository'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const accountRepository = new AccountRepository()
    const bcryptAdapter = new BcryptAdapter(salt)
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
    const validationComposite = makeSignUpValidation()
    const signUpController = new SignUpController(dbAddAccount, validationComposite)
    const logRepository = new LogRepository()
    return new LogControllerDecorator(signUpController, logRepository)
}
