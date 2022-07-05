import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController,
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

describe('Login Controller', () => {
    test('should return 400 if no email is provider', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                password: '123'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('should return 400 if no password is provider', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'email@email.com'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest: HttpRequest = {
            body: {
                email: 'email@email.com',
                password: '123'
            }
        }
        await sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
    })

    test('should return 400 if email is invalid', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest: HttpRequest = {
            body: {
                email: 'invalid_email',
                password: '123'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
})
