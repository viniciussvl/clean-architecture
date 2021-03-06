import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, Authentication } from './login-controller-protocols'

export class LoginController implements Controller {
    private readonly validation: Validation
    private readonly authentication: Authentication

    constructor (authentication: Authentication, validation: Validation) {
        this.validation = validation
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if(error) {
                return badRequest(error)
            }

            const { email, password } = httpRequest.body

            const token = await this.authentication.auth({ email, password })
            if(!token) {
                return unauthorized()
            }

            return ok({ accessToken: token })
        } catch (error) {
            return serverError(error)
        }
    }
}
