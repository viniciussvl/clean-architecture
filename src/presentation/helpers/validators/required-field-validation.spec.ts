import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
    test('should return a MissingParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ name: 'nome qualquer' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'nome qualquer' })
        expect(error).toBeFalsy()
    })
})
