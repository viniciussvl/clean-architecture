import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-procotols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { mockAddAccountRepository, mockHasher } from '@/data/test'

type SutTypes = {
    sut: DbAddAccount,
    hasherStub: Hasher,
    addAccountRepositoryStub: AddAccountRepository,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = mockHasher()
    const addAccountRepositoryStub = mockAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<any> {
            return new Promise(resolve => resolve(null))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

describe('DbAddAccount Usecase', () => {
    test('should call hash with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const hasherSpy = jest.spyOn(hasherStub, 'hash')
        const accountData = mockAddAccountParams()

        await sut.add(accountData)
        expect(hasherSpy).toHaveBeenCalledWith('any_password')
    })

    test('should throw if Hasher throws', async () => {
        const { sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)

        const accountData = mockAddAccountParams()
        const promise = sut.add(accountData)
        expect(promise).rejects.toThrow()
    })

    test('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = mockAddAccountParams()
        await sut.add(accountData)

        expect(addAccountRepositorySpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'hashed_password'
        })
    })

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
        const accountData = mockAddAccountParams()
        const promise = sut.add(accountData)

        expect(promise).rejects.toThrow()
    })

    test('should return an account on success', async () => {
        const { sut } = makeSut()
        const accountData = mockAddAccountParams()
        const account = await sut.add(accountData)

        expect(account).toEqual(mockAccountModel())
    })

    test('should return null if LoadAccountByEmailRepository not return null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))
        const accountData = mockAddAccountParams()
        const account = await sut.add(accountData)

        expect(account).toBeNull()
    })

    test('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(mockAccountModel())

        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })
})
