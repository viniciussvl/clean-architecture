import { mockAccountModel } from '@/domain/test'
import { AccountModel, AddAccount, AddAccountParams, Authentication } from '../controllers/auth/signup/signup-controller-protocols'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountParams): Promise<AccountModel> {
            const fakeAccount = mockAccountModel()
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (AuthenticationParams): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }

    return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load (accessToken: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccountModel()))
        }
    }

    return new LoadAccountByTokenStub()
}
