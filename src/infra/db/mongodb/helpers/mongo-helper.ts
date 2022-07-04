import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
    connection: null as MongoClient,
    db: null as any,

    async connect (url: string): Promise<void> {
        this.connection = await MongoClient.connect(url)
        this.db = await this.connection.db()
    },

    async disconnect (): Promise<void> {
        await this.connection.close()
    },

    getCollection (name: string): Collection {
        return this.db.collection(name)
    },

    map: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}
