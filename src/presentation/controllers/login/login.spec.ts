import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

interface SutTypes {
    sut: LoginController
}

const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return {
        sut
    }
}

describe('Login Controller', () => {
    test('should return 400 if no email is provider', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                password: '123'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('should return 400 if no password is provider', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'email@email.com'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
})
