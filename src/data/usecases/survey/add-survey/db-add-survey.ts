import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
    constructor (private addSurveyRepository: AddSurveyRepository) {}

    async add (surveyData: AddSurveyModel): Promise<void> {
        await this.addSurveyRepository.add(surveyData)
    }
}
