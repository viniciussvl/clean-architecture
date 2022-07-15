import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResult } from '@/domain/test'
import { SaveSurveyResult, SaveSurveyResultParams } from '../controllers/survey-result/save-survey-result/save-survey-result-protocols'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(mockSurveyResult()))
        }
    }

    return new SaveSurveyResultStub()
}
