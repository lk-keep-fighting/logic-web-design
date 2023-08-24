import { StepTypeEnum } from '../../../step-flow-core/types';
import ErrorHandlerRunner from './error-handler';
import HttpRunner from './http';
import JsRunner from './js';

export default {
  js: JsRunner,
  http: HttpRunner,
  [StepTypeEnum.errorHandler]: ErrorHandlerRunner
};
