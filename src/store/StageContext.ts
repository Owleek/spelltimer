import { createContext } from 'react';

export enum EStages {
  EDIT = 'edit',
  PLAY = 'play'
}

const StageContext = createContext<{changeStage: (stage: EStages) => void, currentStage: EStages}>({currentStage: EStages.EDIT, changeStage: () => null});

export default StageContext;