// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { Link } from "react-router-dom";
import './welcome.scss';
import { useContext, useEffect } from "react";
import PageContext, { EPage } from "../../store/pageContext";

const Welcome = () => {
    const context = useContext(PageContext);

    if (!context) return <div>Error</div>
    
    const handleClick = () => {
        context.navigate(EPage.PLAYGROUND);
    }

    return (
        <div className="Welcome innerContainer">
            <h1 className="Welcome__title">На шаг впереди</h1>

            <button className="button" onClick={handleClick}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Приступить
            </button>
        </div>
    );
} ;

export default Welcome;