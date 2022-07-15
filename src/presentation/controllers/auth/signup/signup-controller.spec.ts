import { SignUpController } from './signup-controller'
import { EmailInUseError, MissingParamError } from '../../../errors'
import { AddAccount, HttpRequest, Validation, Authentication } from './signup-controller-protocols'
import { ok, serverError, badRequest, forbidden } from '../../../helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockValidation } from '@/validation/test/mock-validation'
import { mockAddAccount, mockAuthentication } from '@/presentation/test/mock-account'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'Usuariso',
        email: 'email@gmail.com',
        password: '1234',
        passwordConfirmation: '1234'
    }
})

type SutTypes = {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation,
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const addAccountStub = mockAddAccount()
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe('SignUpController', () => {
    test('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')

        const httpRequest = makeFakeRequest()

        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'Usuariso',
            email: 'email@gmail.com',
            password: '1234'
        })
    })

    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test('should return 200 if the params are valid', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(ok({
            accessToken: 'any_token'
        }))
    })

    test('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validationSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith({ email: 'email@gmail.com', password: '1234' })
    })

    test('should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
