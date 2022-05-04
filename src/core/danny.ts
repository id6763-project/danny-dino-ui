import { Step } from './step';

export interface Danny {
  name?: string;
  description?: string;
  status?: string;
  isConnected?: boolean;
  components?: any[];
  logs?: string[];
}

export interface DannySetup {
  steps: Step[];
}
