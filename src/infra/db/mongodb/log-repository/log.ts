import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
        const collection = await MongoHelper.getCollection('error_logs')
        await collection.insertOne({
            stack,
            createdAt: new Date()
        })
    }
}
