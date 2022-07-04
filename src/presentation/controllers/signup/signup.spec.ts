import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorMock implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorMock()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async execute (account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            }

            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountStub()
}

interface SutTypes {
    sut: SignUpController,
    emailValidatorMock: EmailValidator,
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorMock = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorMock, addAccountStub)
    return {
        sut,
        emailValidatorMock,
        addAccountStub
    }
}

describe('SignUpController', () => {
    test('should return 400 if no name is provider', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provider', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provider', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no passwordConfirmation is provider', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                password: '1234'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('should return 400 if passwordConfirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                password: '123456',
                passwordConfirmation: '12345'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('should return 400 if an invalid email is provided', async () => {
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

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct email', async () => {
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

    test('should return 500 if EmailValidator throws', async () => {
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

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'execute')

        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'teste@gmail.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'Usuariso',
            email: 'teste@gmail.com',
            password: '1234'
        })
    })

    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'execute').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })

        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@gmail.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should return 200 if the params are valid', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        })
    })
})
