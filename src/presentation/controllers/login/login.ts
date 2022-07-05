import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor (emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body

            const requiredFields = ['email', 'password']
            for(const field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if(!this.emailValidator.isValid(email)) {
                return badRequest(new InvalidParamError('email'))
            }

            const token = await this.authentication.auth(email, password)
            if(!token) {
                return unauthorized()
            }

            return ok(token)
        } catch (error) {
            return serverError(error)
        }
    }
}