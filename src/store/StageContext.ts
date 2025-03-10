import { createContext } from 'react';

export enum EStages {
  SETTINGS = 'SETTINGS',
  TIMERS = 'TIMERS'
}

export type TStages = EStages.SETTINGS | EStages.TIMERS;

const StageContext = createContext<{changeStage: (stage: TStages) => void} | null>(null);

export default StageContext;