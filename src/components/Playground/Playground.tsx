// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SettingsStage from './SettingsStage/SettingsStage';
import StageContext, {EStages} from '../../store/StageContext';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import {makeSnakeCase} from '../../utils/utils';
import './Playground.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export enum EArticles {
  ABOUT = 'about',
  CONTACT = 'contact',
  POLITICS = 'politics'
}

const Playground = () => {
  const [currentStage, setCurrentStage] = useState<EStages>(EStages.INITIAL);
  const changeStage = (stage: EStages) => setCurrentStage(stage);
  const payload = { currentStage, changeStage };

  return (
    <div className="Playground" style={{backgroundImage: `url("/assets/other/${makeSnakeCase('settings')}.png")`}}>
      <StageContext.Provider value={payload}>
        <Header/>
        <SettingsStage />
        {/* <Footer/> */}
      </StageContext.Provider>
    </div>
  );
}

export default Playground;