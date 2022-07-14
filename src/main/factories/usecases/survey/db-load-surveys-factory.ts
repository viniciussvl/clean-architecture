
import { SurveyRepository } from '@/infra/db/mongodb/repositories/survey/survey-repository'
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/usecases/load-surveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
    const surveyRepository = new SurveyRepository()
    const dbAddSurvey = new DbLoadSurveys(surveyRepository)
    return dbAddSurvey
}
