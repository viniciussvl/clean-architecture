import { AddAccount } from '../../../domain/usecases/add-account'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse, Validation } from '../signup/signup-protocols'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            this.validation.validate(httpRequest.body)

            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for(const field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { name, email, password, passwordConfirmation } = httpRequest.body
            if(password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValidEmail = this.emailValidator.isValid(email)
            if(!isValidEmail) {
                return badRequest(new InvalidParamError('email'))
            }

            const account = await this.addAccount.add({ name, email, password })
            return ok(account)
        } catch (error) {
            return serverError(error)
        }
    }
}
