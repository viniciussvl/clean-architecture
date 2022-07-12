import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
    const account = await accountCollection.insertOne({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho@gmail.com',
        password: '123',
        role: 'admin'
    })

    const id = account.insertedId.toHexString()
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({
        _id: account.insertedId
    }, {
        $set: {
            accessToken
        }
    })

    return accessToken
}

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

        accountCollection = await MongoHelper.getCollection('accounts')
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

    describe('GET /surveys', () => {
        test('should return 403 on load surveys without accessToken', async () => {
            await request(app)
                .get('/api/surveys')
                .expect(403)
        })

        test('should return 204 on load surveys with valid accessToken', async () => {
            const accessToken = await mockAccessToken()

            await request(app)
                .get('/api/surveys')
                .set('x-access-token', accessToken)
                .expect(204)
        })
    })
})
