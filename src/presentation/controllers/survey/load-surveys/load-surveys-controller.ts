import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
    constructor (private loadSurveys: LoadSurveys) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        await this.loadSurveys.load()
        return new Promise(resolve => resolve(null))
    }
}
