import { HttpRequest, AddSurvey, AddSurveyParams, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { mockValidation } from '@/validation/test/mock-validation'
import { mockAddSurvey } from '@/presentation/test/mock-survey'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        }],
        createdAt: new Date()
    }
})

type SutTypes = {
    sut: AddSurveyController,
    validationStub: Validation,
    addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
    const validationStub = mockValidation()
    const addSurveyStub = mockAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
        sut,
        validationStub,
        addSurveyStub
    }
}

describe('Add Survey Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')

        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation fails', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test('should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSurveySpy = jest.spyOn(addSurveyStub, 'add')

        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 500 if AddSurvey throws', async () => {
        const { sut, addSurveyStub } = makeSut()
        jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 204 on success', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(noContent())
    })
})
