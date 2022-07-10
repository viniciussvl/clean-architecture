import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyRepository } from './survey-repository'

const makeSut = (): SurveyRepository => {
    return new SurveyRepository()
}

let surveyCollection: Collection

describe('MongoDB: Account Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    test('should add a survey with success', async () => {
        const sut = makeSut()
        await sut.add({
            question: 'any_question',
            answers: [
                {
                    image: 'any_image',
                    answer: 'any_answer'
                },
                {
                    answer: 'owner_answer'
                }
            ],
            createdAt: new Date()
        })

        const createdSurvey = await surveyCollection.findOne({ question: 'any_question' })
        expect(createdSurvey).toBeTruthy()
    })
})
