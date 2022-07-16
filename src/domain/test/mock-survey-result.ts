import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/save-survey-result'

export const mockSurveyResultData = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    createdAt: new Date()
})

export const mockSurveyResult = (): SurveyResultModel => ({
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [{
        answer: 'any_answer',
        count: 1,
        percent: 50
    },
    {
        answer: 'other_answer',
        image: 'any_image',
        count: 7,
        percent: 90
    }],
    createdAt: new Date()

})
