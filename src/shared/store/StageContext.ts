import { createContext } from 'react';

export enum EStages {
  INITIAL = 'initial',
  EDIT = 'edit',
  PLAY = 'play'
}

const StageContext = createContext<{changeStage: (stage: EStages) => void, currentStage: EStages}>({currentStage: EStages.INITIAL, changeStage: () => null});

export default StageContext;