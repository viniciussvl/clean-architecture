import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
    connection: null as MongoClient,
    db: null as any,
    url: null as string,

    async connect (url: string): Promise<void> {
        this.url = url
        this.connection = await MongoClient.connect(url)
        this.db = await this.connection.db()
    },

    async disconnect (): Promise<void> {
        await this.connection.close()
        this.connection = null
        this.db = null
    },

    async getCollection (name: string): Promise<Collection> {
        if(!this.connection) {
            await this.connect(this.url)
        }

        return this.db.collection(name)
    },

    map: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}
