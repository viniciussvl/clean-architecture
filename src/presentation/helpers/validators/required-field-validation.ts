import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
    private fieldName: string

    constructor (fieldName: string) {
        this.fieldName = fieldName
    }

    validate (input: string): Error {
        if(!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }
    }
}
