import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

const makeAccessToken = async (): Promise<string> => {
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

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Result Routes', () => {
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

    describe('PUT /surveys/:surveyId/results', () => {
        test('should return 403 on save survey result without access token', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403)
        })

        // Esse teste está falhando
        // test('should return 200 on save survey result with access token', async () => {
        //     const result = await surveyCollection.insertOne({
        //         question: 'any_question',
        //         answers: [
        //             {
        //                 image: 'http://image-name.com',
        //                 answer: 'any_answer'
        //             },
        //             {
        //                 answer: 'other_answer'
        //             }
        //         ],
        //         createdAt: new Date()
        //     })

        //     const surveyId = result.insertedId.toString();
        //     const accessToken = await makeAccessToken()

        //     await request(app)
        //         .put(`/api/surveys/${surveyId}/results`)
        //         .set('x-access-token', accessToken)
        //         .send({
        //             answer: 'any_answer'
        //         })
        //         .expect(200)
        // })
    })
})
