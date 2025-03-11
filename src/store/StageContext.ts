import { createContext } from 'react';

export enum EStages {
  SETTINGS = 'settings',
  TIMERS = 'timers'
}

const StageContext = createContext<{changeStage: (stage: EStages) => void} | null>(null);

export default StageContext;