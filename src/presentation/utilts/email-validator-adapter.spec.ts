import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

describe('EmailValidatorAdapter', () => {
    test('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValidEmail = sut.isValid('invalid_email@gmail.com')
        expect(isValidEmail).toBe(false)
    })

    test('should return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter()
        const isValidEmail = sut.isValid('valid_email@mail.com')
        expect(isValidEmail).toBe(true)
    })

    test('should call validator with correct email value', () => {
        const sut = new EmailValidatorAdapter()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@mail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})
