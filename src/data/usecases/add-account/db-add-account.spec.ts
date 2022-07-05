import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-procotols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
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
    email: 'valid_email',
    password: 'hashed_password'
})

const makeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
    test('should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = makeAccountData()

        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

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
            email: 'valid_email',
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
})
