import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUpController', () => {
    test('should return 400 if no name is provider', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provider', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                password: '1234',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provider', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                passwordConfirmation: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no passwordConfirmation is provider', () => {
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                name: 'Usuariso',
                email: 'email@hotmail.com',
                password: '1234'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})
