import { StepTypeEnum } from '../../../step-flow-core/types';
import ErrorHandlerRunner from './error-handler';
import HttpRunner from './http';
import JsRunner from './js';
import MQTTRunner from './mqtt-client';
import WaitRunner from './wait';

export default {
  js: JsRunner,
  http: HttpRunner,
  wait: WaitRunner,
  mqtt: MQTTRunner,
  [StepTypeEnum.errorHandler]: ErrorHandlerRunner
};
