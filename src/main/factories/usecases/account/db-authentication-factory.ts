import { AccountRepository } from '@/infra/db/mongodb/repositories/account/account-repository'
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeDbAuthentication = (): DbAuthentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountRepository = new AccountRepository()
    const dbAuthentication = new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository)
    return dbAuthentication
}
