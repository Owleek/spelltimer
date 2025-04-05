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
        <div className="Welcome innerContainer" style={{backgroundImage: `url("/assets/other/${makeSnakeCase('settings11')}.png")`}}>
            <h1 className="Welcome__title">Control the game by mastering time.</h1>
            <button className="Welcome__button" onClick={handleClick}>
                <i className="Welcone__animationArrow"/>
                <i className="Welcone__animationArrow"/>
                <i className="Welcone__animationArrow"/>
                <i className="Welcone__animationArrow"/>
                <span className="Welcome__buttonText">get started</span>
            </button>
            <div className="footer">
                © 2025 spelltimer.com. <br/>
                 All rights reserved. The spelltimer Logo is a registered trademark of spelltimer, LLC. All Rights Reserved. 
                 <br/>
                 spelltimer, and the spelltimer logo are registered trademarks of spelltimer.
            </div>
        </div>
    );
} ;

export default Welcome;