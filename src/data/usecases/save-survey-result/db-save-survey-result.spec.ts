import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    createdAt: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), {
    id: 'any_id'
})

const makeSaveSurveyResultRepository = () => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResult()))
        }
    }

    return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('should throw if AddSurveyRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const surveyData = makeFakeSurveyResultData()
        const promise = sut.save(surveyData)

        expect(promise).rejects.toThrow()
    })

    test('should return SurveyResult on success', async () => {
        const { sut } = makeSut()
        const surveyData = makeFakeSurveyResultData()
        const surveyResult = await sut.save(surveyData)
        expect(surveyResult).toEqual(makeFakeSurveyResult())
    })
})
