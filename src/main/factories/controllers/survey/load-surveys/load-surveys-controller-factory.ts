import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurveys } from '../../../usecases/survey/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
    const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
    return makeLogControllerDecorator(loadSurveysController)
}
