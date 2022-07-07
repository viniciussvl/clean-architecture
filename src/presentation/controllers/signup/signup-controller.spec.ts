import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = makeFakeAccount()
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error {
            return null
        }
    }

    return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'Usuariso',
        email: 'email@gmail.com',
        password: '1234',
        passwordConfirmation: '1234'
    }
})

interface SutTypes {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(addAccountStub, validationStub)
    return {
        sut,
        addAccountStub,
        validationStub
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

    test('should return 200 if the params are valid', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
})
