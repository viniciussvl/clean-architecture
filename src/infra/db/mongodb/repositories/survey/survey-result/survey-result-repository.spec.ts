import { Collection } from 'mongodb'
import { MongoHelper } from '../../../helpers/mongo-helper'
import { SurveyResultRepository } from './survey-result-repository'

const makeSut = (): SurveyResultRepository => {
    return new SurveyResultRepository()
}

const makeSurvey = async (): Promise<any> => {
    const res: any = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            }
        ],
        createdAt: new Date()
    })

    return res.insertedId
}

const makeAccount = async (): Promise<any> => {
    const res: any = await accountCollection.insertOne({
        email: 'any-email@gmail.com',
        name: 'any name',
        password: '123'
    })

    return res.insertedId
}

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

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

        surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        await surveyResultCollection.deleteMany({})

        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('save()', () => {
        test('should add a survey result if its news', async () => {
            const surveyId = await makeSurvey()
            const accountId = await makeAccount()
            const sut = makeSut()
            const surveyResult = await sut.save({
                surveyId,
                accountId,
                answer: 'any_answer',
                createdAt: new Date()
            })

            expect(surveyResult).toBeTruthy()
        })
    })
})
