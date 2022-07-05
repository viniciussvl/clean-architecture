import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogRepository } from './log'

describe('MongoDB: LogRepository', () => {
    let collection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        collection = await MongoHelper.getCollection('error_logs')
        await collection.deleteMany({})
    })

    it('should create an error log with success', async () => {
        const sut = new LogRepository()
        await sut.logError('any_error')
        const count = await collection.countDocuments()
        expect(count).toBe(1)
    })
})
