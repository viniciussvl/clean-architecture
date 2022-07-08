import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-procotols'

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor (private decrypter: Decrypter) {}

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken)
        return null
    }
}
