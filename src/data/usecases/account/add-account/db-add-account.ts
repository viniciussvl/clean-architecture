import { AddAccount, AccountModel, AddAccountParams, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './db-add-account-procotols'

export class DbAddAccount implements AddAccount {
    constructor (
        private hasher: Hasher,
        private addAccountRepository: AddAccountRepository,
        private loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add (accountData: AddAccountParams): Promise<AccountModel> {
        const existsAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        if(existsAccount) {
            return null
        }

        const hashedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        return account
    }
}
