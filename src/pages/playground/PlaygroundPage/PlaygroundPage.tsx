import React, { useState } from 'react';
import SettingsStage from './SettingsStage/SettingsStage';
import StageContext, {EStages} from '../../../widgets/playground/model/stage-context';
import './Playground.scss';

const PlaygroundPage = () => {
  const [currentStage, setCurrentStage] = useState<EStages>(EStages.INITIAL);
  const changeStage = (stage: EStages) => setCurrentStage(stage);
  const payload = { currentStage, changeStage };

  return (
    <div className="Playground">
      <StageContext.Provider value={payload}>
        <SettingsStage />
      </StageContext.Provider>
    </div>
  );
}

export default PlaygroundPage;
