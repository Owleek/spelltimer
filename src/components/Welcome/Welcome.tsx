import { translateText } from '../../utils/utils';
import { useSelector } from 'react-redux';
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