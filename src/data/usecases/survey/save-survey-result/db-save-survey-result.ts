import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor (private saveSurveyResultRepository: SaveSurveyResultRepository) {}

    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const surveyResult = await this.saveSurveyResultRepository.save(data)
        return surveyResult
    }
}
