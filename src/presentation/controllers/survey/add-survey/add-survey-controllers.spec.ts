import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        }]
    }
})

describe('Add Survey Controller', () => {
    test('should call Validation with correct values', async () => {
        class ValidationStub implements Validation {
            validate (input: any): Error {
                return null
            }
        }

        const validationStub = new ValidationStub()
        const validateSpy = jest.spyOn(validationStub, 'validate')

        const sut = new AddSurveyController(validationStub)
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
