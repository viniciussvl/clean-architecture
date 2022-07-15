import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { mockFakeSurveys, throwError } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'

type SutTypes = {
    sut: DbLoadSurveys,
    loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = mockLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    return {
        sut,
        loadSurveysRepositoryStub
    }
}

describe('DbLoadSurveysSpec Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('should call LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('should return a list of surveys on success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(mockFakeSurveys())
    })

    test('should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
        const promise = sut.load()
        await expect(promise).rejects.toThrow()
    })
})
