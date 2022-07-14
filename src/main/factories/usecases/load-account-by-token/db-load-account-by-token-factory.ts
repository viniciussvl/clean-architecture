import { AccountRepository } from '@/infra/db/mongodb/repositories/account/account-repository'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountRepository = new AccountRepository()
    return new DbLoadAccountByToken(jwtAdapter, accountRepository)
}
