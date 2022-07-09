import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from '../../survey/add-survey/add-survey-validation'
import { makeDbAddSurvey } from '../../../usecases/survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
    const loginController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
    return makeLogControllerDecorator(loginController)
}
