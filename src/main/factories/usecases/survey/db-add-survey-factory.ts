import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { SurveyRepository } from '@/infra/db/mongodb/repositories/survey/survey-repository'
import { AddSurvey } from '@/domain/usecases/add-survey'

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyRepository = new SurveyRepository()
    const dbAddSurvey = new DbAddSurvey(surveyRepository)
    return dbAddSurvey
}
