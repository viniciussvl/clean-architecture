import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogRepository } from '../../../infra/db/mongodb/repositories/log/log-repository'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logRepository = new LogRepository()
    return new LogControllerDecorator(controller, logRepository)
}
