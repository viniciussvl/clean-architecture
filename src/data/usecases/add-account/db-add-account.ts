import { AddAccount, AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-procotols'

export class DbAddAccount implements AddAccount {
    private encrypter: Encrypter
    private addAccountRepository: AddAccountRepository

    constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async execute (accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(accountData.password)
        await this.addAccountRepository.execute(Object.assign({}, accountData, { password: hashedPassword }))
        return new Promise(resolve => resolve(null))
    }
}
