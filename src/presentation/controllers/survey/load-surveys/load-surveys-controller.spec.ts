import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import MockDate from 'mockdate'
import { ok, serverError } from '../../../helpers/http/http-helper'

const makeFakeSurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        }],
        createdAt: new Date()
    },
    {
        id: 'other_id',
        question: 'other_question',
        answers: [{
            answer: 'other_answer',
            image: 'other_image'
        }],
        createdAt: new Date()
    }
])

interface SutTypes {
    sut: LoadSurveysController,
    loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveys()
    const sut = new LoadSurveysController(loadSurveysStub)
    return {
        sut,
        loadSurveysStub
    }
}

const makeLoadSurveys = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load (): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }

    const loadSurveysStub = new LoadSurveysStub()
    return loadSurveysStub
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
        expect(httpResponse).toEqual(ok(makeFakeSurveys()))
    })

    test('should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
