import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { mockSurveyResult, mockSurveyResultData, throwError } from '@/domain/test'
import { mockSaveSurveyResultRepository } from '@/data/test/mock-db-survey-result'

type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

describe('DbAddSurvey Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const surveyResultData = mockSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('should throw if AddSurveyRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
        const surveyData = mockSurveyResultData()
        const promise = sut.save(surveyData)

        expect(promise).rejects.toThrow()
    })

    test('should return SurveyResult on success', async () => {
        const { sut } = makeSut()
        const surveyData = mockSurveyResultData()
        const surveyResult = await sut.save(surveyData)
        expect(surveyResult).toEqual(mockSurveyResult())
    })
})
