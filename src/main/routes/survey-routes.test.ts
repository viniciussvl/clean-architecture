import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})

        accountCollection = await MongoHelper.getCollection('surveys')
        await accountCollection.deleteMany({})
    })

    describe('POST /surveys', () => {
        test('should return 403 on add survey without access token', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [
                        {
                            image: 'http://image-name.com',
                            answer: 'any_answer'
                        },
                        {
                            answer: 'owner_answer'
                        }
                    ]
                })
                .expect(403)
        })
    })
})
