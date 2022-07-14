
import { SurveyRepository } from '@/infra/db/mongodb/repositories/survey/survey-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
    const surveyRepository = new SurveyRepository()
    return new DbLoadSurveyById(surveyRepository)
}
