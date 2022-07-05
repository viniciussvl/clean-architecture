import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller,
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRepositoryStub()
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
    const logErrorRepositoryStub = makeLogRepositoryStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'email@email.com',
        name: 'Developer',
        password: '123',
        passwordConfirmation: '123'
    }
})

describe('LogController Decorator', () => {
    test('should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                ok: true
            }
        })
    })

    test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
