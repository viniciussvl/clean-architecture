import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '../../../helpers/mongo-helper'

export class SurveyResultRepository implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<any> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const surveyResult = await surveyResultCollection.findOneAndUpdate({
            surveyId: data.surveyId,
            accountId: data.accountId
        }, {
            $set: {
                answer: data.answer,
                createdAt: data.createdAt
            }
        }, {
            upsert: true
        })

        return surveyResult
    }
}
