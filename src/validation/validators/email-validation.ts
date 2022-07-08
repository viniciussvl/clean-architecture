import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '../../presentation/protocols'

export class EmailValidation implements Validation {
    private fieldName: string
    private emailValidator: EmailValidator

    constructor (fieldName: string, emailValidator: EmailValidator) {
        this.fieldName = fieldName
        this.emailValidator = emailValidator
    }

    validate (input: any): Error {
        if(!this.emailValidator.isValid(input[this.fieldName])) {
            return new InvalidParamError(this.fieldName)
        }
    }
}
