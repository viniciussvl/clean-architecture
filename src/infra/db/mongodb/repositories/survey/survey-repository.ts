import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveysRepository } from '../../../../../data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.insertOne(surveyData)
    }

    async loadAll (): Promise<any[]> {
        const surveysCollection = await MongoHelper.getCollection('surveys')
        const surveys = await surveysCollection.find().toArray()
        return surveys
    }

    async loadById (id: string): Promise<SurveyModel> {
        const surveysCollection = await MongoHelper.getCollection('surveys')
        const survey: any = await surveysCollection.find({ _id: id }).toArray()
        return survey
    }
}
