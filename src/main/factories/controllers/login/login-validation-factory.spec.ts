import { EmailValidation, ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorMock implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorMock()
}

describe('Login Validation Factory', () => {
    test('should call validationComposite with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] = []
        for(const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new EmailValidation('email', makeEmailValidator()))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
