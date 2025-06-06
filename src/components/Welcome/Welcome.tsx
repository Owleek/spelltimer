// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useContext } from 'react';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import { translate, makeSnakeCase, translateText } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../store/store';
import PlayButton from '../PlayButton/PlayButton';
import cn from 'classnames';
import './welcome.scss';


const Welcome = () => {
    const {dictionary, currentLang} = useSelector((state: TStoreState) => state.localeSlice);
    if (!dictionary) return;

    const fontStyleNormal = currentLang === 'ar' || currentLang === 'zh';

    return (
        <div className="Welcome">
            <div className="Welcome__titleStripe">
                <h1 className={cn('Welcome__title', {fontStyleNormal})}>{translateText(dictionary, 'welcome_title')}</h1>
            </div>
            <PlayButton />
        </div>
    );
} ;

export default Welcome;