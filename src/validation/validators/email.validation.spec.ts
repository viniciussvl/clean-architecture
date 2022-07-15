import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../../presentation/errors'
import { mockEmailValidator } from '../test'

type SutTypes = {
    sut: EmailValidation,
    emailValidatorMock: EmailValidator,
}

const makeSut = (): SutTypes => {
    const emailValidatorMock = mockEmailValidator()
    const sut = new EmailValidation('email', emailValidatorMock)
    return {
        sut,
        emailValidatorMock
    }
}

describe('Email Validation', () => {
    test('should return an error if EmailValidator returns false', async () => {
        const { sut, emailValidatorMock } = makeSut()
        jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_email@gmail.com' })
        expect(error).toEqual(new InvalidParamError('email'))
    })

    test('should throw if EmailValidator throws', async () => {
        const { sut, emailValidatorMock } = makeSut()
        jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        expect(sut.validate).toThrow()
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorMock } = makeSut()
        const validateSpy = jest.spyOn(emailValidatorMock, 'isValid')

        sut.validate({ email: 'any_email@mail.com' })
        expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})
