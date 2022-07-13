import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'

export class DbLoadSurveyById {
    constructor (private loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

    async loadById (id: string): Promise<SurveyModel> {
        await this.loadSurveyByIdRepository.loadById(id)
        return null
    }
}
