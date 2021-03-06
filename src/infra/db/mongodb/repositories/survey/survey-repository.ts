import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveysRepository } from '../../../../../data/protocols/db/survey/load-surveys-repository'
import { AddSurveyParams, AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
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
        const survey: any = await surveysCollection.find({ _id: new ObjectId(id) }).toArray()
        return survey
    }
}
