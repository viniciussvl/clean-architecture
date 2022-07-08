import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class CompareFieldsValidation implements Validation {
    private fieldName: string
    private fieldToCompareName: string

    constructor (fieldName: string, fieldToCompareName: string) {
        this.fieldName = fieldName
        this.fieldToCompareName = fieldToCompareName
    }

    validate (input: any): Error {
        if(input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new InvalidParamError(this.fieldToCompareName)
        }
    }
}
