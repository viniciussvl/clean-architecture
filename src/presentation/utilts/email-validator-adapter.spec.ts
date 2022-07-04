import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidatorAdapter', () => {
    test('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        const isValidEmail = sut.isValid('invalid_email@gmail.com')
        expect(isValidEmail).toBe(false)
    })
})
