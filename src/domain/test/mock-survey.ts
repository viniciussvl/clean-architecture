import { SurveyModel } from '../models/survey'
import { AddSurveyParams } from '../usecases/add-survey'

export const mockSurveyModel = (): SurveyModel => (
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        }],
        createdAt: new Date()
    }
)

export const mockFakeSurveys = (): SurveyModel[] => ([
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

export const mockAddSurveyParams = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer'
        }
    ],
    createdAt: new Date()
})
