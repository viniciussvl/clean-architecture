import { badRequest } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, AddSurvey } from './add-survey-protocols'

export class AddSurveyController implements Controller {
    constructor (
        private validation: Validation,
        private addSurvey: AddSurvey
    ) { }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)
        if(error) {
            return badRequest(error)
        }

        const { question, answers } = httpRequest.body

        await this.addSurvey.add({
            question,
            answers
        })
        return new Promise(resolve => resolve(null))
    }
}
