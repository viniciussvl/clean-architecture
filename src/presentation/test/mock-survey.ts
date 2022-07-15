import { mockFakeSurveys, mockSurveyModel } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/add-survey'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-protocols'
import { LoadSurveys, SurveyModel } from '../controllers/survey/load-surveys/load-surveys-controller-protocols'

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add (data: AddSurveyParams): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load (): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(mockFakeSurveys()))
        }
    }

    const loadSurveysStub = new LoadSurveysStub()
    return loadSurveysStub
}

export const mockLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById (id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(mockSurveyModel()))
        }
    }

    return new LoadSurveyByIdStub()
}
