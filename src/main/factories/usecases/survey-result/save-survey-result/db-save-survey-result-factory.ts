
import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'
import { SurveyResultRepository } from '@/infra/db/mongodb/repositories/survey/survey-result/survey-result-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
    const surveyResultRepository = new SurveyResultRepository()
    return new DbSaveSurveyResult(surveyResultRepository)
}
