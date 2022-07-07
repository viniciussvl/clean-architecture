import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

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

    describe('POST /login', () => {
        test('should return 200 on login', async () => {
            const hashedPassword = await hash('123', 12)
            await accountCollection.insertOne({
                name: 'rodrigo',
                email: 'vinicius@hotmail.com',
                password: hashedPassword
            })

            await request(app)
                .post('/api/login')
                .send({
                    email: 'vinicius@hotmail.com',
                    password: '123'
                })
                .expect(200)
        })

        test('should return 401 when login fails', async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: 'vinicius@hotmail.com',
                    password: '12345'
                })
                .expect(401)
        })
    })
})
