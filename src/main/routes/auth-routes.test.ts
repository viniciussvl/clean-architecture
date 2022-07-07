import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection

describe('Auth Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('POST /signup', () => {
        test('should return 200 on signup', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Vinicius',
                    email: 'vinicius@hotmail.com',
                    password: '123456',
                    passwordConfirmation: '123456'
                })
                .expect(200)
        })
    })
})
