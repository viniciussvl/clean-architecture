import request from 'supertest'
import { AccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Signup Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    it('should return an account on success', async () => {
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

    test('should return an account on success', async () => {
        const sut = new AccountRepository()
        const account = await sut.add({
            name: 'Nome Sobrenome',
            email: 'nomesobrenom@hotmail.com',
            password: '123'
        })

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('Nome Sobrenome')
        expect(account.email).toBe('nomesobrenom@hotmail.com')
        expect(account.password).toBe('123')
    })
})
