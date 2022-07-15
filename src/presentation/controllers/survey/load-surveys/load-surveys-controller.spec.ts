import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import MockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { mockFakeSurveys, throwError } from '@/domain/test'
import { mockLoadSurveys } from '@/presentation/test/mock-survey'

type SutTypes = {
    sut: LoadSurveysController,
    loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
    const loadSurveysStub = mockLoadSurveys()
    const sut = new LoadSurveysController(loadSurveysStub)
    return {
        sut,
        loadSurveysStub
    }
}

describe('LoadSurveys Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('should call LoadSurveys', async () => {
        const { sut, loadSurveysStub } = makeSut()

        const loadSpy = jest.spyOn(loadSurveysStub, 'load')

        await sut.handle({})
        expect(loadSpy).toHaveBeenCalledWith()
    })

    test('should return 200 on success ', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(mockFakeSurveys()))
    })

    test('should return 204 if LoadSurveys returns empty ', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => resolve([])))

        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    })

    test('should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)

        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
