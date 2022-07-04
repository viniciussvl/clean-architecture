import { AddAccount, AccountModel, AddAccountModel, Encrypter } from './db-add-account-procotols'

export class DbAddAccount implements AddAccount {
    private encrypter: Encrypter

    constructor (encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async execute (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)
        return new Promise(resolve => resolve(null))
    }
}
