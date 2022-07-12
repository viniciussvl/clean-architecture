import { LoadSurveysRepository } from '../../../../../data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyRepository implements AddSurveyRepository, LoadSurveysRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.insertOne(surveyData)
    }

    async loadAll (): Promise<any[]> {
        const surveysCollection = await MongoHelper.getCollection('surveys')
        const surveys = await surveysCollection.find().toArray()
        return surveys
    }
}
