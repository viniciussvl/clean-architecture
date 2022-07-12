import 'module-alias/register'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import env from './config/env'

MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const app = (await import('./config/app')).default
        app.listen(env.port, () => console.log(`Server runinng http://localhost:${env.port}`))
    })
    .catch((error) => {
        console.log(error)
    })
