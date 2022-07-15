import { mockAccountModel } from '@/domain/test'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import { AccountModel, AddAccountParams, LoadAccountByEmailRepository } from '../usecases/account/add-account/db-add-account-procotols'

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountParams): Promise<AccountModel> {
            const fakeAccount = mockAccountModel()
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            const account = mockAccountModel()
            return new Promise(resolve => resolve(account))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken (token: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccountModel()))
        }
    }

    return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new UpdateAccessTokenRepositoryStub()
}
