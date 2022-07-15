import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockSurveyModel, throwError } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

type SutTypes = {
    sut: DbLoadSurveyById,
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

describe('DbLoadSurveyById Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('should call LoadSurveyByIdRepository', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadById('any_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('should return Survey on success', async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById('any_id')
        expect(survey).toEqual(mockSurveyModel())
    })

    test('should throw if LoadSurveyByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.loadById('any_id')
        await expect(promise).rejects.toThrow()
    })
})
