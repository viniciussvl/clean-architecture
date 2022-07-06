import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogRepository } from '../../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'

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
