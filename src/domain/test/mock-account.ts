import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/add-account'
import { AuthenticationParams } from '../usecases/authentication'

export const mockAccountModel = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'hashed_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
})

export const mockFakeAuthentication = (): AuthenticationParams => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})
