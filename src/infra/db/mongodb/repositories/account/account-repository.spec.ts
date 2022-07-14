import { Collection } from 'mongodb'
import { AddAccountParams } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountRepository } from './account-repository'

const makeSut = (): AccountRepository => {
    return new AccountRepository()
}

const makeFakeAccount = (): AddAccountParams => ({
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

    describe('add()', () => {
        test('should return an account on add success', async () => {
            const sut = makeSut()
            const account = await sut.add(makeFakeAccount())

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('Nome Sobrenome')
            expect(account.email).toBe('nomesobrenom@hotmail.com')
            expect(account.password).toBe('123')
        })
    })

    describe('loadByEmail()', () => {
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

    describe('updateAccessToken()', () => {
        test('should update the account accessToken on updateAccessToken success', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(makeFakeAccount())
            const accountById = await sut.loadByEmail('nomesobrenom@hotmail.com')
            await sut.updateAccessToken(accountById.id, 'any_token')

            const account = await accountCollection.findOne({ _id: accountById.id })
            expect(account).toBeTruthy()
            expect(account.accessToken).toBe('any_token')
        })
    })

    describe('loadByToken()', () => {
        test('should return an account on loadByToken without role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'Nome Sobrenome',
                email: 'nomesobrenom@hotmail.com',
                password: '123',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token')

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('Nome Sobrenome')
            expect(account.email).toBe('nomesobrenom@hotmail.com')
            expect(account.password).toBe('123')
        })

        test('should return an account on loadByToken with role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'Nome Sobrenome',
                email: 'nomesobrenom@hotmail.com',
                password: '123',
                accessToken: 'any_token',
                role: 'any_role'
            })
            const account = await sut.loadByToken('any_token', 'any_role')

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('Nome Sobrenome')
            expect(account.email).toBe('nomesobrenom@hotmail.com')
            expect(account.password).toBe('123')
        })

        test('should return null if loadByToken fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByToken('any_token')
            expect(account).toBeFalsy()
        })
    })
})
