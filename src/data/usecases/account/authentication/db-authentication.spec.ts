import { DbAuthentication } from './db-authentication'
import {
    HashComparer,
    Encrypter,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { mockFakeAuthentication, throwError } from '@/domain/test'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'

type SutTypes = {
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer,
    encrypterStub: Encrypter,
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const hashComparerStub = mockHashComparer()
    const encrypterStub = mockEncrypter()
    const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}

describe('DbAuthentication ', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(mockFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(mockFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const accessToken = await sut.auth(mockFakeAuthentication())

        expect(accessToken).toBeNull()
    })

    test('should call HashComparer with correct values', async () => {
        const { sut, hashComparerStub } = makeSut()
        const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(mockFakeAuthentication())

        expect(hashComparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(mockFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test('should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(mockFakeAuthentication())

        expect(accessToken).toBeNull()
    })

    test('should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(mockFakeAuthentication())

        expect(encrypterSpy).toHaveBeenCalledWith('any_id')
    })

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(mockFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test('should return a token on success', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(mockFakeAuthentication())

        expect(accessToken).toBe('any_token')
    })

    test('should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(mockFakeAuthentication())

        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    })

    test('should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(mockFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })
})
