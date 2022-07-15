import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/save-survey-result'

export const mockSurveyResultData = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    createdAt: new Date()
})

export const mockSurveyResult = (): SurveyResultModel => Object.assign({}, mockSurveyResultData(), {
    id: 'any_id'
})
