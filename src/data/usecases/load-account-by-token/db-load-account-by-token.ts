import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-procotols'

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor (
        private decrypter: Decrypter,
        private loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) {}

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if(token) {
            await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
        }

        return null
    }
}
