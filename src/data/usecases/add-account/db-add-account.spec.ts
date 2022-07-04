import { Encrypter } from './db-add-account-procotols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)

    return {
        sut,
        encrypterStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        await sut.execute(accountData)

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        const promise = sut.execute(accountData)
        expect(promise).rejects.toThrow()
    })
})