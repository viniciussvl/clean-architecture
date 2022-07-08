import { Hasher, AddAccountModel, AccountModel, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-procotols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount,
    hasherStub: Hasher,
    addAccountRepositoryStub: AddAccountRepository,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
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

const makeHasher = (): Hasher => {
    class HasherStub {
        async hash (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = makeFakeAccount()
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
    test('should call hash with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const hasherSpy = jest.spyOn(hasherStub, 'hash')
        const accountData = makeAccountData()

        await sut.add(accountData)
        expect(hasherSpy).toHaveBeenCalledWith('valid_password')
    })

    test('should throw if Hasher throws', async () => {
        const { sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = makeAccountData()
        const promise = sut.add(accountData)
        expect(promise).rejects.toThrow()
    })

    test('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = makeAccountData()
        await sut.add(accountData)

        expect(addAccountRepositorySpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })
    })

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = makeAccountData()
        const promise = sut.add(accountData)

        expect(promise).rejects.toThrow()
    })

    test('should return an account on success', async () => {
        const { sut } = makeSut()
        const accountData = makeAccountData()
        const account = await sut.add(accountData)

        expect(account).toEqual(makeFakeAccount())
    })

    test('should return null if LoadAccountByEmailRepository not return null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
        const accountData = makeAccountData()
        const account = await sut.add(accountData)

        expect(account).toBeNull()
    })

    test('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(makeFakeAccount())

        expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
    })
})
