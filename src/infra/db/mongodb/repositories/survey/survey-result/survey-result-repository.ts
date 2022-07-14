import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '../../../helpers/mongo-helper'

export class SurveyResultRepository implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<any> {
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
