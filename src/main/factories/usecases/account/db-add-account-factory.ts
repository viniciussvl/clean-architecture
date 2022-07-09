import { AccountRepository } from '../../../../infra/db/mongodb/repositories/account/account-repository'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountRepository = new AccountRepository()
    const dbAuthentication = new DbAddAccount(bcryptAdapter, accountRepository, accountRepository)
    return dbAuthentication
}
