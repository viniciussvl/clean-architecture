import { SurveyAnswer } from '../models/survey'

export interface AddSurveyModel {
    question: string,
    answers: SurveyAnswer[],
    createdAt: Date
}

export interface AddSurvey {
    add (data: AddSurveyModel): Promise<void>;
}
