import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResult } from '@/domain/test'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'

export const mockSaveSurveyResultRepository = () => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(mockSurveyResult()))
        }
    }

    return new SaveSurveyResultRepositoryStub()
}
