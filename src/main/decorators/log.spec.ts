import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller
}

const makeControllerStub = (): Controller => {
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

    return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
    }
}

describe('LogController Decorator', () => {
    test('should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
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
