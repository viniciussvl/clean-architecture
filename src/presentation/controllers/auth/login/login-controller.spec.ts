import { MissingParamError } from '../../../errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation, Authentication } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { throwError } from '@/domain/test'
import { mockAuthentication } from '@/presentation/test'
import { mockValidation } from '@/validation/test/mock-validation'

type SutTypes = {
    sut: LoginController,
    validationStub: Validation,
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return {
        sut,
        validationStub,
        authenticationStub
    }
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'valid@email.com',
        password: '123'
    }
})

describe('Login Controller', () => {
    test('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse).toEqual(unauthorized())
    })

    test('should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })

    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith({ email: 'valid@email.com', password: '123' })
    })

    test('should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
        const httpRequest = mockRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validationSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = mockRequest()

        await sut.handle(httpRequest)
        expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpRequest = mockRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})
