import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
    constructor (
        private readonly loadAccountByToken: LoadAccountByToken
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.['x-access-token']
            if(accessToken) {
                const account = await this.loadAccountByToken.load(accessToken)
                if(account) {
                    return ok({ accountId: account.id })
                }
            }

            const error = forbidden(new AccessDeniedError())
            return new Promise(resolve => resolve(error))
        } catch (error) {
            return serverError(error)
        }
    }
}
