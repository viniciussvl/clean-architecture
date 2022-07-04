import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface SutTypes {
    sut: SignUpController,
    emailValidatorMock: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorMock implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorMock()
}

const makeSut = (): SutTypes => {
    const emailValidatorMock = makeEmailValidator()
    const sut = new SignUpController(emailValidatorMock)
    return {
        sut,
        emailValidatorMock
    }
}

describe('SignUpController', () => {
    test('should return 400 if no name is provider', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provider', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provider', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no passwordConfirmation is provider', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                password: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('should return 400 if passwordConfirmation fails', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                password: '123456',
                passwordConfirmation: '12345'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorMock } = makeSut()
        jest.spyOn(emailValidatorMock, 'isValid')
            .mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'invalid.email',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct email', () => {
        const { sut, emailValidatorMock } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorMock, 'isValid')

        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'teste@gmail.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('should return 500 if EmailValidator throws', () => {
        const { sut, emailValidatorMock } = makeSut()
        jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@gmail.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
})
