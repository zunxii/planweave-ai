import { StepAction } from './common.types';

export interface StepActionPayload {
  stepId: string;
  action: StepAction;
  data?: any;
}