import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
    test('should call controller handle', async () => {
        class ControllerStub implements Controller {
            handle (httpRequest: HttpRequest): Promise<HttpResponse> {
                const httpResponse: HttpResponse = {
                    statusCode: 200,
                    body: {
                        ok: true
                    }
                }
                return new Promise(resolve => resolve(httpResponse))
            }
        }

        const controllerStub = new ControllerStub()
        const handleSpy = jest.spyOn(controllerStub, 'handle')

        const sut = new LogControllerDecorator(controllerStub)
        const httpRequest: HttpRequest = {
            body: {
                email: 'email@email.com',
                name: 'Developer',
                password: '123',
                passwordConfirmation: '123'
            }
        }

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})
