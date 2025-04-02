// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useContext } from 'react';
import ErrorComponent from '../ErrorComponent/ErrorComponent';
import PageContext, { EPage } from '../../store/PageContext';
import {setUserPlayed} from '../../user_cache/keys';
import { translate, makeSnakeCase } from '../../utils/utils';
import './welcome.scss';


const text = {
    title: translate('One step ahead'),
    button: translate('get started')
}

const Welcome = () => {
    const context = useContext(PageContext);

    if (!context) return <ErrorComponent message={String(context)}/>
    
    const handleClick = () => {
        setUserPlayed();
        context.navigate(EPage.PLAYGROUND);
    }

    return (
        <div className="Welcome innerContainer" style={{backgroundImage: `url("/assets/other/${makeSnakeCase('welcome')}.png")`}}>
            <h1 className="Welcome__title">{text.title}</h1>
            <button className="Welcome__button" onClick={handleClick}>
                <span/><span/><span/><span/>
                {text.button}
            </button>
        </div>
    );
} ;

export default Welcome;