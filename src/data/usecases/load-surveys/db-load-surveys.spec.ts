import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'

const makeFakeSurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            answer: 'any_answer',
            image: 'any_image'
        }],
        createdAt: new Date()
    },
    {
        id: 'other_id',
        question: 'other_question',
        answers: [{
            answer: 'other_answer',
            image: 'other_image'
        }],
        createdAt: new Date()
    }
])

describe('DbLoadSurveysSpec Usecase', () => {
    test('should call LoadSurveysRepository', async () => {
        class LoadSurveysRepositoryStub implements LoadSurveysRepository {
            async loadAll (): Promise<SurveyModel[]> {
                return new Promise(resolve => resolve(makeFakeSurveys()))
            }
        }

        const loadSurvyesRepositoryStub = new LoadSurveysRepositoryStub()
        const loadAllSpy = jest.spyOn(loadSurvyesRepositoryStub, 'loadAll')
        const sut = new DbLoadSurveys(loadSurvyesRepositoryStub)
        sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })
})
