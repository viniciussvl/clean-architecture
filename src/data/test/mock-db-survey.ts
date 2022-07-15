import { SurveyModel } from '@/domain/models/survey'
import { mockFakeSurveys, mockSurveyModel } from '@/domain/test/mock-survey'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { AddSurveyParams, AddSurveyRepository } from '../usecases/survey/add-survey/db-add-survey-protocols'

export const mockAddSurveyRepository = () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        add (surveyData: AddSurveyParams): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById (id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(mockSurveyModel()))
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll (): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(mockFakeSurveys()))
        }
    }

    return new LoadSurveysRepositoryStub()
}
