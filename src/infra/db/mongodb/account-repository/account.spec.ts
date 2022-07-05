import { MongoHelper } from '../helpers/mongo-helper'
import { AccountRepository } from './account'

describe('MongoDB: Account Repository', () => {
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
