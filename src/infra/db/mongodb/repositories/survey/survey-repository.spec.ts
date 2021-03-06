import { mockAddSurveyParams } from '@/domain/test'
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

    describe('add()', () => {
        test('should add a survey with success', async () => {
            const sut = makeSut()
            await sut.add(mockAddSurveyParams())

            const createdSurvey = await surveyCollection.findOne({ question: 'any_question' })
            expect(createdSurvey).toBeTruthy()
        })
    })

    describe('loadAll()', () => {
        test('should load surveys on success', async () => {
            await surveyCollection.insertMany([
                {
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ],
                    createdAt: new Date()
                },
                {
                    question: 'other_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        }
                    ],
                    createdAt: new Date()
                }
            ])

            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0].question).toBe('any_question')
            expect(surveys[1].question).toBe('other_question')
        })

        test('should load empty list', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })

    describe('loadById()', () => {
        test('should load survey by id on success', async () => {
            const result: any = await surveyCollection.insertOne(mockAddSurveyParams())

            const sut = makeSut()
            const survey = await sut.loadById(result.insertedId)
            expect(survey).toBeTruthy()
        })
    })
})
