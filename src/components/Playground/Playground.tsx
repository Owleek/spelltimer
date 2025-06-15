// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useState } from 'react';
import SettingsStage from './SettingsStage/SettingsStage';
import StageContext, {EStages} from '../../store/StageContext';
import './Playground.scss';

const Playground = () => {
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

export default Playground;