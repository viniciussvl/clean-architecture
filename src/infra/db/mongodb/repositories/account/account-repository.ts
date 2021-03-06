import { AddAccountRepository } from '../../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../../domain/models/account'
import { AddAccountParams } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'

export class AccountRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
    private collection: string

    constructor () {
        this.collection = 'accounts'
    }

    async add (accountData: AddAccountParams): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection(this.collection)
        const result = await accountCollection.insertOne(accountData)
        const { insertedId: id } = result
        const accountById = await accountCollection.findOne({ _id: id })
        return MongoHelper.map(accountById)
    }

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection(this.collection)
        const account = await accountCollection.findOne({ email })
        return account && MongoHelper.map(account)
    }

    async updateAccessToken (id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection(this.collection)
        await accountCollection.updateOne({
            _id: id
        }, {
            $set: {
                accessToken: token
            }
        })
    }

    async loadByToken (token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection(this.collection)
        const account = await accountCollection.findOne({
            accessToken: token,
            $or: [{
                role
            }, {
                role: 'admin'
            }]
        })
        return account && MongoHelper.map(account)
    }
}
