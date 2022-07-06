import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountRepository } from './account'

const makeSut = (): AccountRepository => {
    return new AccountRepository()
}

const makeFakeAccount = (): AddAccountModel => ({
    name: 'Nome Sobrenome',
    email: 'nomesobrenom@hotmail.com',
    password: '123'
})

let accountCollection: Collection

describe('MongoDB: Account Repository', () => {
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

    test('should return an account on add success', async () => {
        const sut = makeSut()
        const account = await sut.add(makeFakeAccount())

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('Nome Sobrenome')
        expect(account.email).toBe('nomesobrenom@hotmail.com')
        expect(account.password).toBe('123')
    })

    test('should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne(makeFakeAccount())
        const account = await sut.loadByEmail('nomesobrenom@hotmail.com')

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('Nome Sobrenome')
        expect(account.email).toBe('nomesobrenom@hotmail.com')
        expect(account.password).toBe('123')
    })

    test('should return null if loadyByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail('nomesobrenom@hotmail.com')
        expect(account).toBeFalsy()
    })
})
