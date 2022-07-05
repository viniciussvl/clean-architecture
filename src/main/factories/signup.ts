import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utilts/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'
import { LogRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const accountRepository = new AccountRepository()
    const bcryptAdapter = new BcryptAdapter(salt)
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository)
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    const logRepository = new LogRepository()
    return new LogControllerDecorator(signUpController, logRepository)
}
